import { GameScene } from "@/components/game/scene"
import { GameUI } from "@/components/game/ui"

export default function Page() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black text-white selection:bg-cyan-500/30">
      <div className="relative w-full h-full">
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <GameScene />
        </div>

        {/* UI Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <GameUI />
        </div>
      </div>
    </main>
  )
}
