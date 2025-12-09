import { v4 as uuidv4 } from "uuid"
import weaponDataRaw from "./weapons.json"

export type Tag = "Air" | "Armor" | "Structure" | "Infantry" | "Stealth" | "Support" | "Heavy"

export const TAG_DEFINITIONS: Record<Tag, { color: string; abbrev: string }> = {
  Air: { color: "#66ccff", abbrev: "AIR" },
  Armor: { color: "#888888", abbrev: "ARM" },
  Structure: { color: "#aa8844", abbrev: "STR" },
  Infantry: { color: "#44aa44", abbrev: "INF" },
  Stealth: { color: "#aa44aa", abbrev: "STH" },
  Support: { color: "#44aaaa", abbrev: "SUP" },
  Heavy: { color: "#ff6644", abbrev: "HVY" },
}

export type CardData = {
  id: string
  name: string
  cost: number
  hp: number
  maxHp: number
  ad: number
  tags: Tag[]
  owner?: "player1" | "player2"
  instanceId?: string
}

// Convert JSON data to typed object
const WEAPON_DATA: { name: string; tags: Tag[] }[] = weaponDataRaw.map((item) => ({
  name: item.name,
  tags: item.tags as Tag[],
}))

function generateStatsForCost(targetCost: number, tagCount: number): { hp: number; ad: number } {
  const effectiveCost = Math.max(1, targetCost - tagCount)

  const minTotal = effectiveCost === 1 ? 2 : (effectiveCost - 1) * 2 + 1
  const maxTotal = Math.min(18, effectiveCost * 2)

  const total = Math.floor(Math.random() * (maxTotal - minTotal + 1)) + minTotal

  const minHp = Math.max(1, total - 9)
  const maxHp = Math.min(9, total - 1)
  const hp = Math.floor(Math.random() * (maxHp - minHp + 1)) + minHp
  const ad = total - hp

  return { hp, ad }
}

export function generateMasterDeck(): Omit<CardData, "owner">[] {
  const cards: Omit<CardData, "owner">[] = []
  // - logic preserved from original
  const shuffledData = [...WEAPON_DATA].sort(() => Math.random() - 0.5)

  // Generate first 9 cards based on cost 1-9
  for (let cost = 1; cost <= 9; cost++) {
    // Ensure we don't go out of bounds if JSON is small, though logic assumes 26 items
    if (cost - 1 >= shuffledData.length) break
    
    const weapon = shuffledData[cost - 1]
    const { hp, ad } = generateStatsForCost(cost, weapon.tags.length)

    cards.push({
      id: uuidv4(),
      name: weapon.name,
      cost,
      hp,
      maxHp: hp,
      ad,
      tags: weapon.tags,
    })
  }

  // Generate remaining cards (indices 9 to 25)
  for (let i = 9; i < 26; i++) {
    if (i >= shuffledData.length) break

    const weapon = shuffledData[i]
    const hp = Math.floor(Math.random() * 9) + 1
    const ad = Math.floor(Math.random() * 9) + 1
    const totalPower = hp + ad
    const baseCost = Math.ceil(totalPower / 2)
    const cost = Math.max(1, Math.min(9, baseCost + weapon.tags.length))

    cards.push({
      id: uuidv4(),
      name: weapon.name,
      cost,
      hp,
      maxHp: hp,
      ad,
      tags: weapon.tags,
    })
  }

  return cards
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function createPlayerDeck(masterDeck: Omit<CardData, "owner">[], owner: "player1" | "player2"): CardData[] {
  const shuffled = shuffleArray(masterDeck)
  return shuffled.map((card) => ({
    ...card,
    id: uuidv4(), // New ID for this player's copy
    owner,
  }))
}

export function createCardInstance(card: CardData): CardData {
  return {
    ...card,
    instanceId: uuidv4(),
    hp: card.maxHp,
  }
}