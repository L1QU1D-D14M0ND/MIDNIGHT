import { create } from "zustand"
import { type CardData, generateMasterDeck, createPlayerDeck, createCardInstance } from "./card-data"

type GridPosition = { row: number; col: number } | null

type PlayerState = {
  id: "player1" | "player2"
  hand: CardData[]
  field: CardData[]
  deck: CardData[]
  dp: number
  maxDp: number
  fieldPositions: Record<string, GridPosition>
}

type GamePhase = "player1Phase" | "player2Phase" | "endPhase"

export const GRID_CONSTANTS = {
  GRID_SIZE: 4,
  CELL_WIDTH: 2.4,
  CELL_HEIGHT: 3.4,
  MOBILE_SCALE: 0.6,
  P1_BASE_Z: 1.7,
  P2_BASE_Z: -1.7,
}

export const MAX_DP = 10 // Export max DP constant

type GameState = {
  turn: number
  phase: GamePhase
  selectedCardId: string | null
  selectedUnitId: string | null
  draggingCardId: string | null
  viewingCardId: string | null
  player1: PlayerState
  player2: PlayerState
  winner: "player1" | "player2" | null
  combatLog: string[]
  showCombatResults: boolean

  viewingDeckOwner: "player1" | "player2" | null
  viewDeck: (owner: "player1" | "player2" | null) => void

  // Actions
  initializeGame: () => void
  endPhase: () => void
  selectCard: (instanceId: string | null) => void
  selectUnit: (instanceId: string | null) => void
  deselectAll: () => void
  viewCard: (instanceId: string | null) => void
  playCard: (instanceId: string, gridPos: { row: number; col: number }) => void
  startDrag: (instanceId: string) => void
  cancelDrag: () => void
  dismissCombatResults: () => void
  resolveCombat: () => void // Add proper type for resolveCombat
}

const INITIAL_HAND_SIZE = 5
const MAX_HAND_SIZE = 5

export const useGameStore = create<GameState>((set, get) => ({
  turn: 1,
  phase: "player1Phase",
  selectedCardId: null,
  selectedUnitId: null,
  draggingCardId: null,
  viewingCardId: null,
  winner: null,
  combatLog: [],
  showCombatResults: false,

  player1: {
    id: "player1",
    hand: [],
    field: [],
    deck: [],
    dp: 1,
    maxDp: 1,
    fieldPositions: {},
  },

  player2: {
    id: "player2",
    hand: [],
    field: [],
    deck: [],
    dp: 1,
    maxDp: 1,
    fieldPositions: {},
  },

  viewingDeckOwner: null,
  viewDeck: (owner) => set({ viewingDeckOwner: owner }),

  initializeGame: () => {
    const masterDeck = generateMasterDeck()
    const p1Deck = createPlayerDeck(masterDeck, "player1")
    const p2Deck = createPlayerDeck(masterDeck, "player2")

    const p1Hand = p1Deck.splice(0, INITIAL_HAND_SIZE).map(createCardInstance)
    const p2Hand = p2Deck.splice(0, INITIAL_HAND_SIZE).map(createCardInstance)

    set({
      turn: 1,
      phase: "player1Phase",
      winner: null,
      selectedCardId: null,
      selectedUnitId: null,
      draggingCardId: null,
      viewingCardId: null,
      combatLog: [],
      showCombatResults: false,
      player1: {
        id: "player1",
        hand: p1Hand,
        field: [],
        deck: p1Deck,
        dp: 1,
        maxDp: 1,
        fieldPositions: {},
      },
      player2: {
        id: "player2",
        hand: p2Hand,
        field: [],
        deck: p2Deck,
        dp: 1,
        maxDp: 1,
        fieldPositions: {},
      },
    })
  },

  dismissCombatResults: () => {
    const { player1, player2, turn } = get()

    const newP1MaxDp = Math.min(MAX_DP, player1.maxDp + 1)
    const newP2MaxDp = Math.min(MAX_DP, player2.maxDp + 1)

    const p1Hand = [...player1.hand]
    const p1Deck = [...player1.deck]
    if (p1Hand.length < MAX_HAND_SIZE && p1Deck.length > 0) {
      const card = p1Deck.shift()
      if (card) {
        p1Hand.push(createCardInstance(card))
      }
    }

    set({
      turn: turn + 1,
      phase: "player1Phase",
      showCombatResults: false,
      combatLog: [],
      player1: {
        ...player1,
        hand: p1Hand,
        deck: p1Deck,
        dp: newP1MaxDp,
        maxDp: newP1MaxDp,
      },
      player2: {
        ...player2,
        maxDp: newP2MaxDp,
      },
    })
  },

  endPhase: () => {
    const { phase, player2 } = get()

    if (phase === "player1Phase") {
      const newHand = [...player2.hand]
      const newDeck = [...player2.deck]
      if (newHand.length < MAX_HAND_SIZE && newDeck.length > 0) {
        const card = newDeck.shift()
        if (card) {
          newHand.push(createCardInstance(card))
        }
      }

      set({
        phase: "player2Phase",
        selectedCardId: null,
        selectedUnitId: null,
        draggingCardId: null,
        viewingCardId: null,
        player2: {
          ...player2,
          dp: player2.maxDp,
          hand: newHand,
          deck: newDeck,
        },
      })
    } else if (phase === "player2Phase") {
      set({
        phase: "endPhase",
        selectedCardId: null,
        selectedUnitId: null,
        draggingCardId: null,
        viewingCardId: null,
      })

      setTimeout(() => {
        get().resolveCombat()
      }, 100)
    }
  },

  selectCard: (instanceId) => {
    set({ selectedCardId: instanceId, selectedUnitId: null })
  },

  selectUnit: (instanceId) => {
    set({ selectedUnitId: instanceId, selectedCardId: null })
  },

  deselectAll: () => {
    set({ selectedCardId: null, selectedUnitId: null, draggingCardId: null, viewingCardId: null })
  },

  viewCard: (instanceId) => {
    set({ viewingCardId: instanceId })
  },

  startDrag: (instanceId) => {
    const { phase, player1, player2 } = get()
    const activePlayer = phase === "player1Phase" ? "player1" : "player2"
    const currentPlayer = activePlayer === "player1" ? player1 : player2
    const card = currentPlayer.hand.find((c) => c.instanceId === instanceId)

    if (card && currentPlayer.dp >= card.cost) {
      set({ draggingCardId: instanceId, selectedCardId: instanceId })
    }
  },

  cancelDrag: () => {
    set({ draggingCardId: null })
  },

  playCard: (instanceId, gridPos) => {
    const { phase, player1, player2 } = get()
    const activePlayer = phase === "player1Phase" ? "player1" : "player2"
    const currentPlayer = activePlayer === "player1" ? player1 : player2

    const cardIndex = currentPlayer.hand.findIndex((c) => c.instanceId === instanceId)
    if (cardIndex === -1) return

    const card = currentPlayer.hand[cardIndex]

    const isOccupied = Object.values(currentPlayer.fieldPositions).some(
      (pos) => pos && pos.row === gridPos.row && pos.col === gridPos.col,
    )
    if (isOccupied) return

    if (currentPlayer.dp >= card.cost) {
      const newHand = [...currentPlayer.hand]
      newHand.splice(cardIndex, 1)

      const newField = [...currentPlayer.field, card]
      const newPositions = {
        ...currentPlayer.fieldPositions,
        [card.instanceId!]: gridPos,
      }

      set((state) => ({
        selectedCardId: null,
        draggingCardId: null,
        [activePlayer]: {
          ...state[activePlayer],
          hand: newHand,
          field: newField,
          dp: state[activePlayer].dp - card.cost,
          fieldPositions: newPositions,
        },
      }))
    }
  },

  resolveCombat: () => {
    const { player1, player2 } = get()

    const p1Field = [...player1.field]
    const p2Field = [...player2.field]
    const p1Positions = { ...player1.fieldPositions }
    const p2Positions = { ...player2.fieldPositions }
    const p1Deck = [...player1.deck]
    const p2Deck = [...player2.deck]
    const combatLog: string[] = []

    p1Field.forEach((attacker) => {
      const attackerPos = p1Positions[attacker.instanceId!]
      if (!attackerPos) return

      const target = p2Field.find((unit) => {
        const targetPos = p2Positions[unit.instanceId!]
        return targetPos && targetPos.col === attackerPos.col
      })

      if (target) {
        target.hp -= attacker.ad
        combatLog.push(`${attacker.name} deals ${attacker.ad} damage to ${target.name}`)
      }
    })

    p2Field.forEach((attacker) => {
      const attackerPos = p2Positions[attacker.instanceId!]
      if (!attackerPos) return

      const target = p1Field.find((unit) => {
        const targetPos = p1Positions[unit.instanceId!]
        return targetPos && targetPos.col === attackerPos.col
      })

      if (target) {
        target.hp -= attacker.ad
        combatLog.push(`${attacker.name} deals ${attacker.ad} damage to ${target.name}`)
      }
    })

    const defeatedP1 = p1Field.filter((unit) => unit.hp <= 0)
    const defeatedP2 = p2Field.filter((unit) => unit.hp <= 0)

    defeatedP1.forEach((unit) => {
      combatLog.push(`${unit.name} was defeated!`)
      delete p1Positions[unit.instanceId!]
      const baseCard = { ...unit, hp: unit.maxHp, instanceId: undefined }
      p1Deck.push(baseCard)
    })

    defeatedP2.forEach((unit) => {
      combatLog.push(`${unit.name} was defeated!`)
      delete p2Positions[unit.instanceId!]
      const baseCard = { ...unit, hp: unit.maxHp, instanceId: undefined }
      p2Deck.push(baseCard)
    })

    const newP1Field = p1Field.filter((unit) => unit.hp > 0)
    const newP2Field = p2Field.filter((unit) => unit.hp > 0)

    set({
      combatLog: combatLog.length > 0 ? combatLog : ["No combat occurred this turn."],
      showCombatResults: true,
      player1: {
        ...player1,
        field: newP1Field,
        fieldPositions: p1Positions,
        deck: p1Deck,
      },
      player2: {
        ...player2,
        field: newP2Field,
        fieldPositions: p2Positions,
        deck: p2Deck,
      },
    })
  },
}))
