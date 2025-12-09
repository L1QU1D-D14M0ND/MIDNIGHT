"use client"

import { useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import { useSettingsStore } from "@/lib/settings-store"

export function FpsLimiter() {
  const setFrameloop = useThree((state) => state.setFrameloop)
  const invalidate = useThree((state) => state.invalidate)
  const fpsLimit = useSettingsStore((state) => state.fpsLimit)
  
  // Refs to track timing without causing re-renders
  const lastRenderTime = useRef(0)
  const rafRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    // 1. Clean up previous loops immediately
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    // 2. Handle "Uncapped" or "60" (Native Browser Loop)
    if (fpsLimit === "uncapped" || fpsLimit === 60) {
      setFrameloop("always")
      // We don't need to do anything else; R3F handles the loop
    } 
    
    // 3. Handle Limited FPS (30, 24)
    else {
      // Switch to 'demand' mode - R3F stops auto-rendering
      setFrameloop("demand")
      
      const interval = 1000 / (fpsLimit as number)
      
      const tick = (time: number) => {
        rafRef.current = requestAnimationFrame(tick)
        
        // Calculate time elapsed since last actual render
        const delta = time - lastRenderTime.current
        
        // If enough time has passed for this FPS target, trigger a frame
        if (delta > interval) {
          invalidate() // This tells R3F "Render one frame now"
          
          // Adjust time to account for the interval, preventing drift
          lastRenderTime.current = time - (delta % interval)
        }
      }

      // Initialize the loop
      lastRenderTime.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }

    // Cleanup on unmount or settings change
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      setFrameloop("always") // Safety fallback
    }
  }, [fpsLimit, setFrameloop, invalidate])

  return null
}