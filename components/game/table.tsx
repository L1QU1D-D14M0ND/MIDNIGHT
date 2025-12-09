"use client"

import { useGameStore, GRID_CONSTANTS } from "@/lib/store"
import { useState, useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh, Shape } from "three"
import { useShallow } from "zustand/react/shallow"
import { Unit3D } from "./unit-3d"

interface GridCellProps {
  row: number
  col: number
  position: [number, number, number]
  owner: "player1" | "player2"
}

function GridCell({ row, col, position, owner }: GridCellProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<Mesh>(null)
  const pulseRef = useRef(0)

  const { phase, selectedCardId, playCard, fieldPositions, cardToPlaceData } = useGameStore(
    useShallow((state) => {
        const activeId = state.selectedCardId;
        const foundCard = activeId ? (
            state.player1.hand.find(c => c.instanceId === activeId) || 
            state.player2.hand.find(c => c.instanceId === activeId)
        ) : null;

        return {
          phase: state.phase,
          selectedCardId: state.selectedCardId,
          playCard: state.playCard,
          fieldPositions: owner === "player1" ? state.player1.fieldPositions : state.player2.fieldPositions,
          cardToPlaceData: foundCard
        }
    })
  )

  const { MOBILE_SCALE, CELL_WIDTH, CELL_HEIGHT } = GRID_CONSTANTS
  const slotScale = typeof window !== "undefined" && window.innerWidth < 768 ? MOBILE_SCALE : 1

  const activePlayer = phase === "player1Phase" ? "player1" : phase === "player2Phase" ? "player2" : null
  const isOccupied = Object.values(fieldPositions).some((pos) => pos && pos.row === row && pos.col === col)

  const hasCardSelected = selectedCardId !== null
  const canPlace = hasCardSelected && activePlayer === owner && !isOccupied
  const showHighlight = canPlace && hovered

  useFrame((_, delta) => {
    if (canPlace) {
      pulseRef.current += delta * 3
    } else {
      pulseRef.current = 0
    }
  })

  const cellWidth = (CELL_WIDTH - 0.2) * slotScale
  const cellHeight = (CELL_HEIGHT - 0.2) * slotScale

  const borderColor = showHighlight ? "#00ff88" : canPlace ? "#44aaff" : "#ffffff"
  const borderOpacity = showHighlight ? 1 : canPlace ? 0.6 + Math.sin(pulseRef.current) * 0.2 : 0.1
  
  const bgOpacity = showHighlight ? 0.3 : 0.05
  const bgColor = showHighlight ? "#00ff88" : "#000000"

  const ghostPosition: [number, number, number] = [0, 0.55, 0]

  return (
    <group position={position}>
      {showHighlight && cardToPlaceData && (
        <Unit3D 
            card={cardToPlaceData} 
            position={ghostPosition} 
            ghost={true} 
        />
      )}

      {/* Marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[cellWidth, cellHeight]} />
        <meshBasicMaterial color={bgColor} transparent opacity={bgOpacity} />
      </mesh>

      {/* Outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[Math.min(cellWidth, cellHeight) * 0.48, Math.min(cellWidth, cellHeight) * 0.49, 4]} />
        <meshBasicMaterial color={borderColor} transparent opacity={borderOpacity} />
      </mesh>
      
      {/* Corner dashes */}
      {[[-1,-1], [-1,1], [1,-1], [1,1]].map(([xSig, ySig], i) => (
         <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[xSig * cellWidth/2, 0.003, ySig * cellHeight/2]}>
            <planeGeometry args={[0.4, 0.05]} />
            <meshBasicMaterial color={borderColor} transparent opacity={borderOpacity} />
         </mesh>
      ))}

      {/* Hitbox */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (canPlace) {
            playCard(selectedCardId!, { row, col })
          }
        }}
        visible={false}
      >
        <planeGeometry args={[cellWidth, cellHeight]} />
      </mesh>
    </group>
  )
}

function CornerRail({ radius, thickness, height, color }: { radius: number, thickness: number, height: number, color: string }) {
    const shape = useMemo(() => {
        const s = new Shape();
        const rOut = radius + thickness
        const rIn = radius
        s.moveTo(rOut, 0);
        s.absarc(0, 0, rOut, 0, Math.PI / 2, false);
        s.lineTo(0, rIn);
        s.absarc(0, 0, rIn, Math.PI / 2, 0, true);
        s.lineTo(rOut, 0);
        return s;
    }, [radius, thickness]);

    return (
        <mesh rotation={[-Math.PI/2, 0, 0]}>
            <extrudeGeometry args={[shape, { depth: height, bevelEnabled: false, curveSegments: 32 }]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>
    )
}

export function Table() {
  const { GRID_SIZE, CELL_WIDTH, CELL_HEIGHT, P1_BASE_Z, P2_BASE_Z } = GRID_CONSTANTS

  const generateGridCells = (owner: "player1" | "player2") => {
    const cells = []
    const baseZ = owner === "player1" ? P1_BASE_Z : P2_BASE_Z
    const zDirection = owner === "player1" ? 1 : -1

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = (col - (GRID_SIZE - 1) / 2) * CELL_WIDTH
        const z = baseZ + row * CELL_HEIGHT * zDirection
        cells.push(
          <GridCell key={`${owner}-${row}-${col}`} row={row} col={col} position={[x, 0.02, z]} owner={owner} />,
        )
      }
    }
    return cells
  }

  // FIX 1: Increased Table Dimensions
  // Adding +8 width provides space on sides for the decks
  const tableWidth = GRID_SIZE * CELL_WIDTH + 8
  const tableHeight = 4 * CELL_HEIGHT + 4
  const cornerRadius = 2.5
  
  const railThickness = 1.5
  const railHeight = 0.3
  
  // FIX 2: Lighter Colors to avoid "black bug"
  const railColor = "#804010" // SaddleBrown (Lighter than before)
  const feltColor = "#207050" // SeaGreen (Brighter/Lighter than before)

  const innerWidth = tableWidth - cornerRadius * 2
  const innerHeight = tableHeight - cornerRadius * 2

  return (
    <group position={[0, -0.5, 0]}>
      {/* --- Main Table Surface (Felt) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[innerWidth, tableHeight]} />
        <meshStandardMaterial color={feltColor} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[tableWidth, innerHeight]} />
        <meshStandardMaterial color={feltColor} roughness={0.8} />
      </mesh>
      {[
          [innerWidth/2, innerHeight/2], 
          [-innerWidth/2, innerHeight/2], 
          [innerWidth/2, -innerHeight/2], 
          [-innerWidth/2, -innerHeight/2]
      ].map(([x, y], i) => (
          <mesh key={`felt-corner-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, y]} receiveShadow>
            <circleGeometry args={[cornerRadius, 32]} />
            <meshStandardMaterial color={feltColor} roughness={0.8} />
          </mesh>
      ))}

      {/* --- The Rail --- */}
      <group position={[0, 0, 0]}> 
        <mesh position={[0, railHeight/2, (innerHeight/2 + cornerRadius + railThickness/2)]}>
            <boxGeometry args={[innerWidth, railHeight, railThickness]} />
            <meshStandardMaterial color={railColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, railHeight/2, -(innerHeight/2 + cornerRadius + railThickness/2)]}>
            <boxGeometry args={[innerWidth, railHeight, railThickness]} />
            <meshStandardMaterial color={railColor} roughness={0.5} />
        </mesh>
        <mesh position={[(innerWidth/2 + cornerRadius + railThickness/2), railHeight/2, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[innerHeight, railHeight, railThickness]} />
            <meshStandardMaterial color={railColor} roughness={0.5} />
        </mesh>
        <mesh position={[(innerWidth/2 + cornerRadius + railThickness/2) * -1, railHeight/2, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[innerHeight, railHeight, railThickness]} />
            <meshStandardMaterial color={railColor} roughness={0.5} />
        </mesh>

        <group position={[innerWidth/2, 0, innerHeight/2]} rotation={[0, -Math.PI/2, 0]}>
            <CornerRail radius={cornerRadius} thickness={railThickness} height={railHeight} color={railColor} />
        </group>
        <group position={[-innerWidth/2, 0, innerHeight/2]} rotation={[0, -Math.PI, 0]}>
            <CornerRail radius={cornerRadius} thickness={railThickness} height={railHeight} color={railColor} />
        </group>
        <group position={[-innerWidth/2, 0, -innerHeight/2]} rotation={[0, Math.PI/2, 0]}>
            <CornerRail radius={cornerRadius} thickness={railThickness} height={railHeight} color={railColor} />
        </group>
        <group position={[innerWidth/2, 0, -innerHeight/2]} rotation={[0, 0, 0]}>
            <CornerRail radius={cornerRadius} thickness={railThickness} height={railHeight} color={railColor} />
        </group>
      </group>

      {/* Betting Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
         <planeGeometry args={[tableWidth - 2, 0.05]} />
         <meshBasicMaterial color="#d4af37" transparent opacity={0.4} />
      </mesh>

      {/* Grid Cells */}
      {generateGridCells("player1")}
      {generateGridCells("player2")}
    </group>
  )
}