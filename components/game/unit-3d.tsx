"use client"

import { useRef, useState, useLayoutEffect } from "react"
import { Outlines, Text } from "@react-three/drei"
import { Group, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import { MathUtils } from "three"
import type { CardData } from "@/lib/card-data"
import { useGameStore, GRID_CONSTANTS } from "@/lib/store"
import { useMobile } from "@/hooks/use-mobile"
import { useShallow } from "zustand/react/shallow"

interface Unit3DProps {
  card: CardData
  position?: [number, number, number]
  ghost?: boolean
}

export function Unit3D({ card, position = [0, 0, 0], ghost = false }: Unit3DProps) {
  const group = useRef<Group>(null)
  const [hovered, setHover] = useState(false)
  const isMobile = useMobile()

  // We use a Ref to store the target position to allow for smooth interpolation
  // This prevents "snapping" and ensures movement is time-based (Delta Time)
  const targetPos = useRef(new Vector3(position[0], position[1], position[2]))

  const { phase, viewCard, viewingCardId, selectUnit, selectedUnitId } = useGameStore(
    useShallow((state) => ({
      phase: state.phase,
      viewCard: state.viewCard,
      viewingCardId: state.viewingCardId,
      selectUnit: state.selectUnit,
      selectedUnitId: state.selectedUnitId,
    }))
  )

  const activePlayer = phase === "player1Phase" ? "player1" : phase === "player2Phase" ? "player2" : "player1"
  const baseColor = card.owner === "player1" ? "#00f0ff" : "#ff0055"
  const isOwned = card.owner === activePlayer
  const isViewing = viewingCardId === card.instanceId
  const isSelected = selectedUnitId === card.instanceId

  const handleClick = (e: any) => {
    if (ghost) return
    e.stopPropagation()
    if (viewingCardId === card.instanceId) {
      viewCard(null)
      selectUnit(null)
    } else {
      viewCard(card.instanceId!)
      selectUnit(card.instanceId!)
    }
  }

  // Update target position whenever the prop changes
  useLayoutEffect(() => {
    // We adjust Y slightly to sit on top of the grid (handled in render previously, now here)
    targetPos.current.set(position[0], -0.375, position[2])
    
    // If it's a ghost (placement preview), snap instantly. No sliding.
    if (ghost && group.current) {
        group.current.position.copy(targetPos.current)
    }
  }, [position[0], position[1], position[2], ghost])

  const unitScale = isMobile ? GRID_CONSTANTS.MOBILE_SCALE : 1
  const unitWidth = 2 * unitScale
  const unitHeight = 3 * unitScale
  const faceWidth = unitWidth * 0.94
  const faceHeight = unitHeight * 0.94
  const barHeight = unitHeight * 0.18
  const topBarY = unitHeight * 0.36
  const bottomBarY = -unitHeight * 0.36
  const fontSizeName = 0.18 * unitScale
  const fontSizeStats = 0.22 * unitScale
  const fontSizeCost = 0.22 * unitScale

  // --- ANIMATION LOOP ---
  useFrame((state, delta) => {
    if (!group.current) return

    // 1. ROTATION (Existing Logic - Good)
    const isPlayer1View = phase === "player1Phase" || phase === "endPhase"
    const targetZ = isPlayer1View ? 0 : Math.PI
    
    // Smoothly rotate
    group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, targetZ, delta * 8)
    
    // Ensure flat orientation
    group.current.rotation.x = -Math.PI / 2
    group.current.rotation.y = 0

    // 2. POSITION (New Logic - Fixes Slow Motion/Jitter)
    // Instead of snapping, we lerp to the target position.
    // 'delta * 12' means the movement speed is consistent regardless of FPS.
    if (!ghost) {
        group.current.position.lerp(targetPos.current, delta * 12)
    }
  })

  // Visual State
  const opacity = ghost ? 0.6 : (!isOwned ? 0.8 : 1)
  const transparent = ghost || !isOwned
  const emission = ghost ? 0.5 : 0
  
  const CARD_BG = "#1a1a2e"
  const BAR_BG = "#000000"
  const COST_BG = "#eab308"
  const TEXT_RED = "#ef4444"
  const TEXT_GREEN = "#22c55e"

  const eventHandlers = ghost ? {} : {
    onPointerOver: () => setHover(true),
    onPointerOut: () => setHover(false),
    onClick: handleClick
  }

  return (
    <group
      ref={group}
      // Initial position (will be taken over by useFrame immediately)
      position={[position[0], -0.375, position[2]]}
      {...eventHandlers}
    >
      {/* 1. Card Base */}
      <mesh raycast={ghost ? () => null : undefined}> 
        <boxGeometry args={[unitWidth, unitHeight, 0.05]} />
        <meshStandardMaterial
          color={isViewing || isSelected ? "#ffff00" : baseColor}
          transparent={transparent}
          opacity={opacity}
          emissive={baseColor}
          emissiveIntensity={emission}
          roughness={0.3}
        />
        {!ghost && <Outlines thickness={2} color={isViewing || isSelected ? "#ffff00" : hovered ? "#ffffff" : "#000000"} />}
      </mesh>

      {/* 2. Card Face */}
      <group position={[0, 0, 0.03]}>
        <mesh raycast={ghost ? () => null : undefined}>
            <planeGeometry args={[faceWidth, faceHeight]} />
            <meshBasicMaterial color={CARD_BG} transparent={ghost} opacity={opacity} />
        </mesh>

        {/* --- Top Bar --- */}
        <group position={[0, topBarY, 0.001]}>
            <mesh raycast={ghost ? () => null : undefined}>
                <planeGeometry args={[faceWidth, barHeight]} />
                <meshBasicMaterial color={BAR_BG} transparent opacity={opacity * 0.8} />
            </mesh>
            
            <mesh position={[-faceWidth * 0.4, 0, 0.01]} raycast={ghost ? () => null : undefined}>
                <circleGeometry args={[0.2 * unitScale, 32]} />
                <meshBasicMaterial color={COST_BG} transparent={ghost} opacity={opacity} />
            </mesh>
            <Text
                position={[-faceWidth * 0.4, 0, 0.02]}
                fontSize={fontSizeCost}
                color="#000000"
                fillOpacity={opacity}
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {card.cost}
            </Text>

            <Text
                position={[0.1 * unitScale, 0, 0.02]}
                fontSize={fontSizeName}
                color="#ffffff"
                fillOpacity={opacity}
                anchorX="center"
                anchorY="middle"
                maxWidth={faceWidth * 0.7}
                fontWeight="bold"
            >
                {card.name}
            </Text>
        </group>

        {/* --- Art Area --- */}
        <mesh position={[0, 0, 0.001]} raycast={ghost ? () => null : undefined}>
             <planeGeometry args={[faceWidth, faceHeight * 0.5]} />
             <meshBasicMaterial color="#2a2a3e" transparent={ghost} opacity={opacity} />
             <Outlines thickness={1} color="#000000" />
        </mesh>

        {/* --- Bottom Bar --- */}
        <group position={[0, bottomBarY, 0.001]}>
            <mesh raycast={ghost ? () => null : undefined}>
                <planeGeometry args={[faceWidth, barHeight]} />
                <meshBasicMaterial color={BAR_BG} transparent opacity={opacity * 0.9} />
            </mesh>

            <group position={[-faceWidth * 0.25, 0, 0.01]}>
                <Text 
                    position={[-0.2 * unitScale, 0, 0]} 
                    fontSize={fontSizeStats * 0.7} 
                    color={TEXT_RED} 
                    anchorX="right" 
                    anchorY="middle" 
                    fontWeight="bold"
                    fillOpacity={opacity}
                >
                    AD
                </Text>
                <Text
                    position={[0, 0, 0]}
                    fontSize={fontSizeStats}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                    fontWeight="bold"
                    fillOpacity={opacity}
                >
                    {card.ad}
                </Text>
            </group>

            <group position={[faceWidth * 0.25, 0, 0.01]}>
                <Text 
                    position={[-0.2 * unitScale, 0, 0]} 
                    fontSize={fontSizeStats * 0.7} 
                    color={TEXT_GREEN} 
                    anchorX="right" 
                    anchorY="middle" 
                    fontWeight="bold"
                    fillOpacity={opacity}
                >
                    HP
                </Text>
                <Text
                    position={[0, 0, 0]}
                    fontSize={fontSizeStats}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                    fontWeight="bold"
                    fillOpacity={opacity}
                >
                    {card.hp}
                </Text>
            </group>
        </group>
      </group>
    </group>
  )
}