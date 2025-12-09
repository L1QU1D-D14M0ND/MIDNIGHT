"use client"

import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"
import { useGameStore } from "@/lib/store"

export function CameraManager() {
  const phase = useGameStore((state) => state.phase)
  const selectedCardId = useGameStore((state) => state.selectedCardId)
  const selectedUnitId = useGameStore((state) => state.selectedUnitId)

  useFrame((state) => {
    const isPlayer1View = phase === "player1Phase" || phase === "endPhase"

    const hasSelection = selectedCardId !== null || selectedUnitId !== null

    let targetPos: Vector3
    let lookTarget: Vector3

    if (hasSelection) {
      targetPos = new Vector3(0, 16, isPlayer1View ? 20 : -20)
      lookTarget = new Vector3(0, -5, isPlayer1View ? -2 : 2)
    } else {
      // Default camera position
      targetPos = isPlayer1View ? new Vector3(0, 10, 20) : new Vector3(0, 10, -20)
      lookTarget = isPlayer1View ? new Vector3(0, -1, -2) : new Vector3(0, -1, 2)
    }

    state.camera.position.lerp(targetPos, 0.05)
    state.camera.lookAt(lookTarget)
  })

  return null
}
