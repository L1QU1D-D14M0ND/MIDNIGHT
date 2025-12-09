"use client"

import { useFrame } from "@react-three/fiber"
import { useState, useRef } from "react"
import { Html } from "@react-three/drei"

export function FpsCounter() {
  const [fps, setFps] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(0)

  // Standard frame counting logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    frameCount.current++

    if (time >= lastTime.current + 1) {
      setFps(Math.round((frameCount.current * 1) / (time - lastTime.current)))
      frameCount.current = 0
      lastTime.current = time
    }
  })

  // Color logic based on performance
  const fpsColor = fps >= 55 ? "text-cyan-400" : fps >= 30 ? "text-yellow-400" : "text-red-500"

  // We use `fullscreen` to overlay on the screen, matching the ui.tsx z-index layering
  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <div className="absolute bottom-20 left-3 z-0">
        <div className="bg-black/90 border border-gray-800 px-3 py-2 flex items-center gap-3 shadow-lg backdrop-blur-sm">
          {/* Decorative blinking light */}
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
          
          <div className="font-mono text-xs tracking-wider flex items-center gap-2">
            <span className="text-gray-500 font-bold">SYS.FPS</span>
            <span className={`font-bold ${fpsColor} text-sm drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]`}>
              {fps}
            </span>
          </div>
        </div>
      </div>
    </Html>
  )
}