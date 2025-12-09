"use client"

import { useRef, useState } from "react"
import { Outlines, Text } from "@react-three/drei"
import type { Group } from "three"
import { useFrame } from "@react-three/fiber"
import { MathUtils } from "three"
import { useMobile } from "@/hooks/use-mobile"
import { useGameStore, GRID_CONSTANTS } from "@/lib/store"
import { useShallow } from "zustand/react/shallow"

interface Deck3DProps {
  count: number
  owner: "player1" | "player2"
  position: [number, number, number]
}

export function Deck3D({ count, owner, position }: Deck3DProps) {
  const groupRef = useRef<Group>(null)
  const textGroupRef = useRef<Group>(null) // Ref for the rotating text
  const isMobile = useMobile()
  const [hovered, setHovered] = useState(false)

  // Connect to store with shallow selector
  const { viewDeck, phase } = useGameStore(
    useShallow((state) => ({
      viewDeck: state.viewDeck,
      phase: state.phase,
    }))
  )

  const cardScale = isMobile ? GRID_CONSTANTS.MOBILE_SCALE : 1
  const cardWidth = 2 * cardScale
  const cardHeight = 3 * cardScale

  const baseColor = owner === "player1" ? "#00f0ff" : "#ff0055"

  // Determine if this deck is interactive based on the turn
  const isActivePlayer = 
    (owner === "player1" && phase === "player1Phase") || 
    (owner === "player2" && phase === "player2Phase")

  // FIX 1: Rotation Logic for the Text
  // Matches Unit3D logic: Face the active camera view
  useFrame((state, delta) => {
    if (!textGroupRef.current) return

    // Identify which way is "up" for the current view
    // P1 View (Phase 1 or End) -> 0 rotation
    // P2 View (Phase 2) -> 180 (PI) rotation
    const isPlayer1View = phase === "player1Phase" || phase === "endPhase"
    const targetZ = isPlayer1View ? 0 : Math.PI

    // Smoothly rotate the text group around the vertical axis
    textGroupRef.current.rotation.z = MathUtils.lerp(
      textGroupRef.current.rotation.z, 
      targetZ, 
      delta * 8
    )
  })

  // FIX 2: Interaction Restriction
  const handleClick = (e: any) => {
    e.stopPropagation()
    // Only allow opening if it's the owner's turn
    if (isActivePlayer) {
      viewDeck(owner)
    }
  }

  if (count === 0) return null

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={handleClick}
      onPointerOver={() => isActivePlayer && setHovered(true)} // Only show hover effect if clickable
      onPointerOut={() => setHovered(false)}
    >
      {/* FIX 3: Removed the "Halo" Ring Mesh completely */}

      {/* Stack of cards */}
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <group key={i} position={[0, i * 0.06 * cardScale, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[cardWidth, cardHeight, 0.08 * cardScale]} />
            <meshToonMaterial color="#1a0a2e" />
            {/* Highlight outline only on hover + active turn */}
            <Outlines thickness={hovered ? 2 : 1} color={hovered ? "#ffffff" : baseColor} />
          </mesh>
          
          {/* Top Card Decorations */}
          {i === Math.min(count, 5) - 1 && (
            <group position={[0, 0, 0.05 * cardScale]}>
              <mesh>
                <planeGeometry args={[cardWidth * 0.9, cardHeight * 0.9]} />
                <meshToonMaterial color="#c9a227" />
              </mesh>
              <mesh position={[0, 0, 0.001]}>
                <planeGeometry args={[cardWidth * 0.82, cardHeight * 0.82]} />
                <meshToonMaterial color="#2d1b4e" />
              </mesh>
              <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI / 4]}>
                <planeGeometry args={[0.5 * cardScale, 0.5 * cardScale]} />
                <meshToonMaterial color="#c9a227" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Count Indicator - Now Rotates */}
      <group 
        ref={textGroupRef}
        position={[0, Math.min(count, 5) * 0.06 * cardScale + 0.2 * cardScale, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} // Base layout flat on table, Z-rotation handled by useFrame
      >
        <mesh>
          <planeGeometry args={[0.8 * cardScale, 0.5 * cardScale]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
        <Text
          position={[0, 0, 0.01]} // Slight offset to prevent Z-fighting with black backing
          fontSize={0.3 * cardScale}
          color={baseColor}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {count}
        </Text>
      </group>
    </group>
  )
}