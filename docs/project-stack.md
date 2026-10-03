# Project stack

**Status: current playable prototype.** This document describes the game the repository runs today. It is the source of truth for the build.

The design documents are the direction the game is being rewritten toward. They are not implemented.

- [World](world.md) — Elisabeth, Operation Downfall, and Majestic-12. Unfinished.
- [Mechanics](mechanics.md) — the design rules: commander, Doomsday Clock, Chips, lanes, and card flow. Not in the build.
- [Cards](cards.md) — the Black File legend files.

| | This prototype | Design documents |
| --- | --- | --- |
| Currency | Deployment Points. Start at 1, maximum rises by 1 after combat, cap 10. Unspent points do not bank. | Chips. Start at 1, maximum rises by 1 at the end of each round, cap 10. Unspent Chips do not bank. |
| Win | Units in the same column damage each other. There is no commander and no match-ending health total. | The match ends when a commander reaches 0 health. Effects resolve one at a time, so both commanders are not reduced together. |
| Board | A 4-column grid. Each player has a side. Combat hits the enemy in the same column. | Five shared lanes. Each player has a front slot and a back slot in each lane. |
| Cards | Generated from `lib/weapons.json` with HP, attack, cost, and tags. | Authored Black File files in [Cards](cards.md). |
| Time | Turns and phases only. | A six-step Doomsday Clock. |

## Core framework

- **Next.js 16.0.3.** React full-stack framework, App Router, server and client components, TypeScript.
- **React 19.2.0 and React DOM 19.2.0.**
- **TypeScript 5.x.**

## 3D graphics and rendering

- **React Three Fiber 9.4.0.** React renderer for Three.js.
- **Three.js 0.181.2.** WebGL rendering and 3D math.
- **@react-three/drei 10.7.7.** Helpers used by the scene: `Text`, `Outlines`, `Environment`.
- **@react-three/postprocessing 3.0.4.** Bloom, scanline, and noise.
- **postprocessing 6.38.0.** Effect composer.

## State

- **Zustand 5.0.8.** Match state in `lib/store.ts` (players, cards, phases, combat). Client settings in `lib/settings-store.ts` (FPS cap, persisted).

## Styling

- **Tailwind CSS 4.1.9.** Utility classes and the tokens in `app/globals.css`.
- **tailwindcss-animate 1.0.7**, **tw-animate-css 1.3.3**, **tailwind-merge 3.3.1**, **class-variance-authority 0.7.1**, **clsx 2.1.1**.

## Installed UI packages

These packages are in `package.json`. The match UI is the HTML overlay in `components/game/ui.tsx`. `sonner` is mounted from `app/layout.tsx`. The rest of this list is installed and is not what the table plays.

- **Radix UI primitives.** Accordion, alert dialog, avatar, checkbox, collapsible, context menu, dialog, dropdown menu, hover card, label, menubar, navigation menu, popover, progress, radio group, scroll area, select, separator, slider, switch, tabs, toast, toggle, tooltip.
- **Lucide React 0.454.0.**
- **sonner 1.7.4.**
- **vaul 1.1.2**, **cmdk 1.0.4**.
- **React Hook Form 7.60.0**, **@hookform/resolvers 3.10.0**, **Zod 3.25.76**.
- **uuid 13.0.0**, **date-fns 4.1.0**, **react-day-picker 9.8.0**, **embla-carousel-react 8.5.1**, **input-otp 1.4.1**, **react-resizable-panels 2.1.7**, **recharts 2.15.4**, **next-themes 0.4.6**.
- **@vercel/analytics 1.3.1**.

## Build

- **PostCSS 8.5**, **autoprefixer 10.4.20**, **@tailwindcss/postcss 4.1.9**.
- **@types/node ^22**, **@types/react ^19**, **@types/react-dom ^19**.

## Code layout

Game components in `components/game/`:

- `camera-manager.tsx` — camera position and transitions.
- `deck-3d.tsx` — deck pile.
- `scene.tsx` — React Three Fiber scene.
- `table.tsx` — poker table and grid cells.
- `ui.tsx` — HTML overlay: HUD, hand, card info.
- `unit-3d.tsx` — a deployed unit on the table.
- `fps-limiter.tsx` — frame cap.
- `fps-counter.tsx` — frame readout.

Game logic in `lib/`:

- `store.ts` — Zustand match state.
- `card-data.ts` — card generation and the tag list.
- `weapons.json` — the hardware names and tags the generator draws from.
- `settings-store.ts` — persisted FPS and settings-panel state.

Hooks in `hooks/`:

- `use-mobile.tsx` — narrow-viewport detection.

The hand is the HTML overlay. There is no `card-3d.tsx`.

## Visual style

90s anime look, built from:

- `MeshToonMaterial` for cel shading.
- Outlines on meshes.
- Bloom for neon highlights.
- Scanlines and film-grain noise.

Colors in the prototype:

- Player 1: cyan `#00d4ff`.
- Player 2: pink `#ff66b2`.
- Gold accents: `#ffd700`.
- Table felt: `#1a5a1a`.

## Prototype rules

These are the rules in `lib/store.ts` and `lib/card-data.ts`.

### Resources

- Deployment Points (DP) pay for cards.
- Both players start at 1 DP, with a maximum of 1.
- Unspent DP does not carry. A player is refilled to their current maximum at the start of their phase.
- After combat results are dismissed, both maximums increase by 1, capped at 10. Player 1 is refilled to the new maximum immediately. Player 2 is refilled to it when their phase starts.

### Cards

- Stats are HP, attack damage, DP cost, and tags.
- The generator builds cards from `lib/weapons.json`.
- Tags used by the generator: Air, Armor, Structure, Infantry, Stealth, Support, Heavy.
- Opening hand is 5. Maximum hand size is 5.

### Board and turns

- The grid is 4 columns. Each player deploys on their own side.
- Phases: Player 1, Player 2, then an end phase that resolves combat.
- In combat, each unit deals its attack to the enemy unit in the same column.
- A unit with no enemy in that column deals no damage. There is no commander to strike.
- A defeated unit is removed from the field and placed back on that player's deck at full HP.

### What this build does not do

No Doomsday Clock, no Chips, no commander health, no Black File abilities, and no authored legend roster. A defeated prototype unit is placed on its owner's deck at full health. The design instead shuffles a killed card into the draw pile, and it adds a graveyard and capture, which this build does not have.
