"use client"

import type React from "react"
import { useGameStore } from "@/lib/store"
import { useSettingsStore, type FpsOption } from "@/lib/settings-store" // Import Settings Store
import { TAG_DEFINITIONS } from "@/lib/card-data"
import { useEffect, useState, useRef } from "react"
import { X, Layers, Settings, Monitor } from "lucide-react" // Import Settings Icon
import { useMobile } from "@/hooks/use-mobile"
import type { CardData } from "@/lib/card-data"
import { useShallow } from "zustand/react/shallow"


// --- EXISTING COMPONENT: HandCard (Restored) ---
function HandCard({
  card,
  index,
  total,
  isSelected,
  canAfford,
  isNewlyDrawn,
  animationDelay,
  onSelect,
}: {
  card: CardData
  index: number
  total: number
  isSelected: boolean
  canAfford: boolean
  isNewlyDrawn: boolean
  animationDelay: number
  onSelect: () => void
}) {
  const isMobile = useMobile()
  const [isHovered, setIsHovered] = useState(false)

  // 1. Dimensions
  const baseWidth = isMobile ? 60 : 90
  const baseHeight = isMobile ? 84 : 126

  // 2. Calculate Fan Positions
  const centerIndex = (total - 1) / 2
  const offset = index - centerIndex
  const spacing = isMobile ? 45 : 60
  const xPosition = offset * spacing
  const rotationDeg = offset * (isMobile ? 3 : 5) 
  const yOffset = Math.abs(offset) * (isMobile ? 4 : 12) 

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  // 3. Dynamic Transform Logic
  let transformStyle = ""
  let zIndexStyle = index

  if (isSelected) {
    transformStyle = "translateY(-60px) scale(1.15) rotate(0deg)"
    zIndexStyle = 50
  } else if (isHovered) {
    transformStyle = `translateY(-${yOffset + 20}px) scale(1.1) rotate(${rotationDeg / 2}deg)`
    zIndexStyle = 40
  } else {
    transformStyle = `translateY(${yOffset}px) rotate(${rotationDeg}deg)`
  }

  return (
    <div
      className="absolute transition-all duration-300 ease-out cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: baseWidth,
        height: baseHeight,
        left: "50%",
        bottom: 0, 
        marginLeft: xPosition - baseWidth / 2,
        transform: transformStyle,
        transformOrigin: "bottom center",
        zIndex: zIndexStyle,
        animation: isNewlyDrawn ? `slideIn 0.3s ease-out ${animationDelay}s both` : undefined,
        pointerEvents: "auto",
      }}
      onClick={handleClick}
    >
      <div
        className={`w-full h-full border-2 flex flex-col overflow-hidden ${
          isSelected
            ? "border-yellow-400 shadow-lg shadow-yellow-400/50"
            : canAfford
              ? "border-gray-600 hover:border-gray-400"
              : "border-gray-800"
        }`}
        style={{
          backgroundColor: "#1a1a2e",
          filter: canAfford ? "none" : "grayscale(70%) brightness(0.5)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.5)" 
        }}
      >
        <div
          className="bg-black/70 flex items-center gap-1 border-b border-gray-700"
          style={{ padding: "0px" }}
        >
          {/* DP cost */}
          <div
            className="flex-shrink-0 bg-yellow-500 rounded-xl border border-black flex items-center justify-center font-bold text-black"
            style={{
              width: isMobile ? 14 : 18,
              height: isMobile ? 14 : 18,
              fontSize: isMobile ? 8 : 10,
              padding: 0,
            }}
          >
            {card.cost}
          </div>
          {/* Name */}
          <span className="text-white font-bold truncate flex-1" style={{ fontSize: isMobile ? 6 : 8 }}>
            {card.name}
          </span>
        </div>

        {/* Art area placeholder */}
        <div className="flex-1 relative">
          {card.tags && card.tags.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-bold"
                  style={{
                    fontSize: isMobile ? 6 : 8,
                    padding: "1px 3px",
                    backgroundColor: TAG_DEFINITIONS[tag]?.color || "#444",
                    color: "#000",
                  }}
                >
                  {TAG_DEFINITIONS[tag]?.abbrev || tag.substring(0, 3)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="bg-black/80 px-1 py-0.5 flex justify-between items-center border-t border-gray-700">
          <div className="flex items-center gap-0.5">
            <span className="text-red-500 font-bold" style={{ fontSize: isMobile ? 8 : 10 }}>
              AD
            </span>
            <span className="text-white font-bold" style={{ fontSize: isMobile ? 9 : 11 }}>
              {card.ad}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-green-500 font-bold" style={{ fontSize: isMobile ? 8 : 10 }}>
              HP
            </span>
            <span className="text-white font-bold" style={{ fontSize: isMobile ? 9 : 11 }}>
              {card.hp}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}



// --- NEW COMPONENT: Simple Card Display for Lists ---
function MiniCard({ card, isMobile }: { card: CardData; isMobile: boolean }) {
  return (
    <div className="relative border border-gray-700 bg-[#1a1a2e] flex flex-col overflow-hidden group hover:border-yellow-500 transition-colors"
         style={{ width: isMobile ? 70 : 100, height: isMobile ? 98 : 140 }}>
       
       {/* Header */}
       <div className="bg-black/80 p-1 flex justify-between items-center border-b border-gray-800">
          <div className="w-4 h-4 rounded bg-yellow-500 text-black text-[10px] flex items-center justify-center font-bold">
            {card.cost}
          </div>
       </div>

       {/* Body */}
       <div className="flex-1 flex items-center justify-center p-1">
          <span className="text-white text-[10px] text-center font-bold leading-tight">
             {card.name}
          </span>
       </div>

       {/* Stats */}
       <div className="bg-black/80 flex justify-between px-1 py-0.5 text-[10px]">
          <span className="text-red-400 font-bold">{card.ad}</span>
          <span className="text-green-400 font-bold">{card.hp}</span>
       </div>
    </div>
  )
}

// --- NEW COMPONENT: Deck Viewer Modal ---
function DeckViewerModal({ 
  owner, 
  cards, 
  onClose 
}: { 
  owner: "player1" | "player2", 
  cards: CardData[], 
  onClose: () => void 
}) {
  const isMobile = useMobile()
  const isP1 = owner === "player1"
  
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className={`relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-[#0a0a12] border-2 ${isP1 ? "border-cyan-500 shadow-[0_0_30px_rgba(0,240,255,0.2)]" : "border-pink-500 shadow-[0_0_30px_rgba(255,0,85,0.2)]"}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-800 flex justify-between items-center ${isP1 ? "bg-cyan-950/30" : "bg-pink-950/30"}`}>
            <div className="flex items-center gap-3">
                <Layers className={isP1 ? "text-cyan-400" : "text-pink-400"} />
                <div>
                    <h2 className="text-white font-bold text-lg tracking-wider">
                        {isP1 ? "PLAYER 1" : "PLAYER 2"} DECK
                    </h2>
                    <p className="text-gray-400 text-xs uppercase">{cards.length} Cards Remaining</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X />
            </button>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-4">
            {cards.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-gray-500">
                    DECK DEPLETED
                </div>
            ) : (
                <div className="flex flex-wrap gap-3 justify-center content-start">
                    {/* Sort cards by cost for better readability */}
                    {[...cards].sort((a,b) => a.cost - b.cost).map((card, i) => (
                        <MiniCard key={i} card={card} isMobile={isMobile} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

// --- UPDATED SETTINGS MODAL ---
function SettingsModal({ onClose }: { onClose: () => void }) {
  const { fpsLimit, setFpsLimit } = useSettingsStore()
  
  const FpsButton = ({ value, label }: { value: FpsOption, label: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setFpsLimit(value)
        // No need to reload or close - effect in FpsLimiter handles the switch instantly
      }}
      className={`px-4 py-2 border font-bold text-xs tracking-wider transition-all duration-200 
        ${fpsLimit === value 
          ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" 
          : "bg-black/50 text-gray-400 border-gray-700 hover:border-white hover:text-white"
        }`}
    >
      {label}
    </button>
  )

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-[#0a0a12] border border-gray-800 shadow-2xl p-0 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-900/50 p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Settings size={18} />
            <span className="font-bold tracking-widest">SYSTEM SETTINGS</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400 uppercase tracking-wider font-bold">
              <Monitor size={14} />
              <span>Frame Rate Cap</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <FpsButton value="uncapped" label="MAX" />
              <FpsButton value={60} label="60" />
              <FpsButton value={30} label="30" />
              <FpsButton value={24} label="24" />
            </div>
            <p className="text-[10px] text-gray-600">
              Low FPS simulates retro aesthetics. 
              <br />
              <span className="text-yellow-600/80">Note: Game speed remains constant.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-black/50 flex justify-center">
            <div className="text-[10px] text-gray-600 font-mono">
                POKER BEBOP v0.1.0 // LIVE CONFIG
            </div>
        </div>
      </div>
    </div>
  )
}

export function GameUI() {
  const {
    turn,
    phase,
    player1,
    player2,
    endPhase,
    initializeGame,
    combatLog,
    showCombatResults,
    dismissCombatResults,
    viewingCardId,
    viewCard,
    selectedCardId,
    selectCard,
    viewingDeckOwner,
    viewDeck
  } = useGameStore(
    useShallow((state) => ({
      turn: state.turn,
      phase: state.phase,
      player1: state.player1,
      player2: state.player2,
      endPhase: state.endPhase,
      initializeGame: state.initializeGame,
      combatLog: state.combatLog,
      showCombatResults: state.showCombatResults,
      dismissCombatResults: state.dismissCombatResults,
      viewingCardId: state.viewingCardId,
      viewCard: state.viewCard,
      selectedCardId: state.selectedCardId,
      selectCard: state.selectCard,
      viewingDeckOwner: state.viewingDeckOwner,
      viewDeck: state.viewDeck,
    }))
  )

  const { isSettingsOpen, toggleSettings } = useSettingsStore()

  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()
  const [drawnCardsKey, setDrawnCardsKey] = useState(0)
  const [drawnCards, setDrawnCards] = useState<Set<string>>(new Set())
  const prevHandIdsRef = useRef<string[]>([])
  const prevPhaseRef = useRef<string>(phase)

  useEffect(() => {
    setMounted(true)
    initializeGame()
  }, [initializeGame])

  const activePlayer = phase === "player1Phase" ? "player1" : phase === "player2Phase" ? "player2" : null
  const currentPlayer = activePlayer === "player1" ? player1 : activePlayer === "player2" ? player2 : null
  const enemyPlayer = activePlayer === "player1" ? player2 : activePlayer === "player2" ? player1 : null

  const currentHandIds = currentPlayer ? currentPlayer.hand.map((c) => c.instanceId!) : []

  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      setDrawnCards(new Set())
      setDrawnCardsKey((k) => k + 1)
      prevHandIdsRef.current = currentHandIds
      prevPhaseRef.current = phase
      return
    }
    const newCards = currentHandIds.filter((id) => !prevHandIdsRef.current.includes(id))
    if (newCards.length > 0) {
      setDrawnCards((prev) => new Set([...prev, ...newCards]))
    }
    prevHandIdsRef.current = currentHandIds
  }, [currentHandIds, phase])

  if (!mounted) return null

  const viewingCard = viewingCardId
    ? player1.hand.find((c) => c.instanceId === viewingCardId) ||
      player1.field.find((c) => c.instanceId === viewingCardId) ||
      player2.hand.find((c) => c.instanceId === viewingCardId) ||
      player2.field.find((c) => c.instanceId === viewingCardId)
    : null

  const viewingLocation = viewingCardId
    ? player1.hand.find((c) => c.instanceId === viewingCardId)
      ? "P1 Hand"
      : player1.field.find((c) => c.instanceId === viewingCardId)
        ? "P1 Field"
        : player2.hand.find((c) => c.instanceId === viewingCardId)
          ? "P2 Hand"
          : player2.field.find((c) => c.instanceId === viewingCardId)
            ? "P2 Field"
            : null
    : null

  const phaseText = phase === "player1Phase" ? "P1 DEPLOY" : phase === "player2Phase" ? "P2 DEPLOY" : "COMBAT"

  const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-black/90 border border-gray-800 ${className}`}>{children}</div>
  )

  const StatRow = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs uppercase">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  )

  const handleBackgroundClick = () => {
    if (selectedCardId) {
      selectCard(null)
    }
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between font-mono text-sm"
      onClick={handleBackgroundClick}
    >
      {/* Settings Modal Layer */}
      {isSettingsOpen && (
        <div className="pointer-events-auto">
          <SettingsModal onClose={toggleSettings} />
        </div>
      )}

      {/* Deck Viewer Modal (Existing) */}
      {viewingDeckOwner && (
            <div className="pointer-events-auto">
                <DeckViewerModal 
                    owner={viewingDeckOwner}
                    cards={viewingDeckOwner === "player1" ? player1.deck : player2.deck}
                    onClose={() => viewDeck(null)}
                />
            </div>
        )}

      {/* Top Bar */}
      <div className="flex items-start justify-between gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        {/* Enemy Info (Left Side) */}
        <div className="flex gap-2">
            {activePlayer && enemyPlayer && (
              <Panel className="px-3 py-2 opacity-60">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{activePlayer === "player1" ? "P2" : "P1"}</span>
              <span className="text-white font-bold">
                {enemyPlayer.dp}/{enemyPlayer.maxDp}
              </span>
              <span className="text-gray-600">
                H:{enemyPlayer.hand.length} D:{enemyPlayer.deck.length}
              </span>
            </div>
          </Panel>
            )}
        </div>

        {/* Right Side: Phase + Settings Button */}
        <div className="flex gap-2">
             <Panel className="px-4 py-2 text-center">
               <div className="flex items-center gap-3">
                 <span className="text-gray-500">T{turn}</span>
                 <span
                   className={`font-bold ${
                     phase === "player1Phase"
                       ? "text-cyan-400"
                       : phase === "player2Phase"
                         ? "text-pink-400"
                         : "text-yellow-400"
                   }`}
                 >
                   {phaseText}
                 </span>
               </div>
             </Panel>
             
             {/* NEW: Settings Button */}
             <button 
                onClick={toggleSettings}
                className="bg-black/90 border border-gray-800 w-10 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-colors"
             >
                <Settings size={18} />
             </button>
        </div>
      </div>

      {/* Combat Results Modal */}
      {phase === "endPhase" && showCombatResults && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Panel className="p-4 max-w-sm w-full mx-4 border-yellow-500/50">
            <h3 className="text-yellow-400 font-bold mb-3 text-center tracking-wider">COMBAT</h3>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto mb-4 text-gray-400">
              {combatLog.length > 0 ? (
                combatLog.map((log, i) => <div key={i}>{log}</div>)
              ) : (
                <div className="text-center text-gray-600">No combat occurred</div>
              )}
            </div>
            <button
              onClick={dismissCombatResults}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 text-sm transition-colors"
            >
              OK
            </button>
          </Panel>
        </div>
      )}

      {viewingCard && (
        <div
          className={`absolute ${isMobile ? "top-16 left-3 right-3" : "top-1/2 right-3 -translate-y-1/2 w-48"} pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <Panel
            className={`p-3 border-l-2 ${viewingCard.owner === "player1" ? "border-l-cyan-500" : "border-l-pink-500"}`}
          >
            <button
              onClick={() => viewCard(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>

            <div className="text-white font-bold mb-1 pr-4 truncate">{viewingCard.name}</div>
            <div className="text-[10px] text-gray-600 uppercase mb-2">{viewingLocation}</div>

            {viewingCard.tags && viewingCard.tags.length > 0 && (
              <div className="flex gap-1 mb-2 flex-wrap">
                {viewingCard.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 font-bold"
                    style={{ backgroundColor: TAG_DEFINITIONS[tag]?.color || "#ccc", color: "#000" }}
                  >
                    {TAG_DEFINITIONS[tag]?.abbrev || tag.substring(0, 3)}
                  </span>
                ))}
              </div>
            )}

            <div className={`flex ${isMobile ? "gap-4" : "flex-col gap-1"}`}>
              <StatRow label="DP" value={viewingCard.cost} color="text-yellow-400" />
              <StatRow label="AD" value={viewingCard.ad} color="text-red-400" />
              <StatRow label="HP" value={`${viewingCard.hp}/${viewingCard.maxHp}`} color="text-green-400" />
            </div>
          </Panel>
        </div>
      )}

      {/* Hand Cards */}
      {activePlayer && currentPlayer && (
        <div
          key={`hand-${activePlayer}-${drawnCardsKey}`}
          className="absolute bottom-16 left-0 right-0"
          style={{ height: isMobile ? 100 : 140, pointerEvents: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          {currentPlayer.hand.map((card, i) => (
            <HandCard
              key={card.instanceId}
              card={card}
              index={i}
              total={currentPlayer.hand.length}
              isSelected={selectedCardId === card.instanceId}
              canAfford={currentPlayer.dp >= card.cost}
              isNewlyDrawn={drawnCards.has(card.instanceId!)}
              animationDelay={i * 0.1}
              onSelect={() => {
                if (selectedCardId === card.instanceId) {
                  selectCard(null)
                  viewCard(null)
                } else {
                  viewCard(card.instanceId!)
                  if (currentPlayer.dp >= card.cost) {
                    selectCard(card.instanceId!)
                  }
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom Bar */}
      {activePlayer && currentPlayer && (
        <div className="flex items-end gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Player Resources */}
          <Panel
            className={`flex-1 p-3 border-l-2 ${activePlayer === "player1" ? "border-l-cyan-500" : "border-l-pink-500"}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={activePlayer === "player1" ? "text-cyan-400" : "text-pink-400"}>
                  {activePlayer === "player1" ? "P1" : "P2"}
                </span>
                <span className="text-white font-bold text-lg">
                  {currentPlayer.dp}
                  <span className="text-gray-600 text-sm">/{currentPlayer.maxDp}</span>
                </span>
                <span className="text-gray-600 text-xs">DP</span>
              </div>

              <div className="flex-1 max-w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${activePlayer === "player1" ? "bg-cyan-500" : "bg-pink-500"}`}
                  style={{ width: `${(currentPlayer.dp / currentPlayer.maxDp) * 100}%` }}
                />
              </div>

              <div className="text-gray-600 text-xs">
                H:{currentPlayer.hand.length} D:{currentPlayer.deck.length}
              </div>
            </div>
          </Panel>

          <button
            onClick={endPhase}
            className={`px-4 py-3 font-bold text-xs tracking-wider transition-colors border ${
              activePlayer === "player1"
                ? "border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                : "border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-black"
            }`}
          >
            READY
          </button>
        </div>
      )}
    </div>
  )
}