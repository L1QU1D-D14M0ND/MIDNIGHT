"use client";

import { Canvas } from "@react-three/fiber";
import { FpsCounter } from "./fps-counter";
import { FpsLimiter } from "./fps-limiter";
import {
	EffectComposer,
	Bloom,
	Noise,
	Scanline,
	Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useGameStore, GRID_CONSTANTS } from "@/lib/store";
import { Table } from "./table";
import { Unit3D } from "./unit-3d";
import { Deck3D } from "./deck-3d";
import { CameraManager } from "./camera-manager";
import { Suspense } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useShallow } from "zustand/react/shallow";

function GameContent() {
	const { player1, player2 } = useGameStore(
		useShallow((state) => ({
			player1: state.player1,
			player2: state.player2,
		}))
	);
	const isMobile = useMobile();

	const {
		GRID_SIZE,
		CELL_WIDTH,
		CELL_HEIGHT,
		P1_BASE_Z,
		P2_BASE_Z,
		MOBILE_SCALE,
	} = GRID_CONSTANTS;

	const getGridWorldPosition = (
		gridPos: { row: number; col: number },
		owner: "player1" | "player2"
	) => {
		const baseZ = owner === "player1" ? P1_BASE_Z : P2_BASE_Z;
		const zDirection = owner === "player1" ? 1 : -1;
		const x = (gridPos.col - (GRID_SIZE - 1) / 2) * CELL_WIDTH;
		const z = baseZ + gridPos.row * CELL_HEIGHT * zDirection;
		return [x, 0.03, z] as [number, number, number];
	};

	const deckScale = isMobile ? MOBILE_SCALE : 1;
	const p1DeckPos: [number, number, number] = [6 * deckScale, 0, 8];
	const p2DeckPos: [number, number, number] = [-6 * deckScale, 0, -8];

	return (
		<>
			<CameraManager />

			{/* Lighting */}
			<ambientLight intensity={0.8} color="#ffffff" />
			<spotLight
				position={[0, 15, 0]}
				intensity={1.5}
				angle={0.6}
				penumbra={1}
				castShadow
			/>
			<pointLight position={[-5, 5, 0]} intensity={1.2} color="#ff0055" />
			<pointLight position={[5, 5, 0]} intensity={1.2} color="#00f0ff" />

			{/* Table & Environment */}
			<Table />

			{/* Decks */}
			<Deck3D
				count={player1.deck.length}
				owner="player1"
				position={p1DeckPos}
			/>
			<Deck3D
				count={player2.deck.length}
				owner="player2"
				position={p2DeckPos}
			/>

			{/* Units */}
            {/* NOTE: If units move slowly at low FPS, ensure Unit3D uses `delta` 
                in useFrame: position.x += speed * delta */}
			{player1.field.map((card) => {
				const gridPos = player1.fieldPositions[card.instanceId!];
				if (!gridPos) return null;
				return (
					<Unit3D
						key={card.instanceId}
						card={card}
						position={getGridWorldPosition(gridPos, "player1")}
					/>
				);
			})}

			{player2.field.map((card) => {
				const gridPos = player2.fieldPositions[card.instanceId!];
				if (!gridPos) return null;
				return (
					<group
						key={card.instanceId}
						position={getGridWorldPosition(gridPos, "player2")}
					>
						<Unit3D card={card} position={[0, 0, 0]} />
					</group>
				);
			})}

			{/* Post Processing */}
			<EffectComposer>
				<Bloom
					luminanceThreshold={0.5}
					mipmapBlur
					intensity={1.2}
					radius={0.6}
				/>
				<Scanline density={2.5} opacity={0.12} />
				<Noise opacity={0.1} blendFunction={BlendFunction.OVERLAY} />
				<Vignette eskil={false} offset={0.1} darkness={0.8} />
			</EffectComposer>
		</>
	);
}

export function GameScene() {
	const { cancelDrag, deselectAll } = useGameStore(
		useShallow((state) => ({
			cancelDrag: state.cancelDrag,
			deselectAll: state.deselectAll,
		}))
	);

	return (
		<div className="w-full h-screen bg-black relative">
			<Canvas
				shadows
                // dpr is important for performance. [1, 2] caps it at 2x pixel ratio.
                dpr={[1, 2]} 
				camera={{ position: [0, 14, 18], fov: 45 }}
				onPointerMissed={() => {
					deselectAll();
				}}
			>
				<Suspense fallback={null}>
					<GameContent />
				</Suspense>
				
                {/* Limiter controls the loop, Counter visualizes it */}
				<FpsLimiter />
				<FpsCounter />
			</Canvas>
		</div>
	);
}