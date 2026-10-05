# Project stack

**Status: current playable prototype.** This document describes the game the repository runs today. It is the source of truth for the build.

The design documents are the direction the game is being rewritten toward. They are not implemented.

- [World](world.md) — Elisabeth, Operation Downfall, and Majestic-12. Unfinished.
- [Mechanics](mechanics.md) — the design rules: commander, Doomsday Clock, Chips, lanes, and card flow. Not in the build.
- [Cards](cards.md) — the Black File legend files.
- [Common cards](common/README.md) — the mundane assets. The first six are written. The rest of that roster is open.

| | This prototype | Design documents |
| --- | --- | --- |
| Currency | Deployment Points. Start at 1, maximum rises by 1 after combat, cap 10. Unspent points do not bank. | Chips. Start at 1, maximum rises by 1 at the end of each round, cap 10. Unspent Chips do not bank. |
| Win | Both sides damage each other in the same resolution. Nothing sets a winner, so the match does not end. | The match ends when a commander reaches 0 health. Effects resolve one at a time, so both commanders are not reduced together. |
| Board | Each player has 4 columns and 2 rows. Combat matches the column and ignores the row. | Five shared lanes. Each player has a front slot and a back slot in each lane. |
| Cards | One generated list of 26 cards from `lib/weapons.json`. Each player gets a shuffled copy. | Authored Black File files in [Cards](cards.md), and common assets in [Common cards](common/README.md). |
| Time | Turns and phases only. | A six-step Doomsday Clock. |

## Core framework

Versions below are the ones installed from `package-lock.json`.

- **Next.js 16.0.8.** React full-stack framework, App Router, server and client components, TypeScript.
- **React 19.2.0 and React DOM 19.2.0.**
- **TypeScript 5.9.3.**

## 3D graphics and rendering

- **React Three Fiber 9.4.0.** React renderer for Three.js.
- **Three.js 0.181.2.** WebGL rendering and 3D math.
- **@react-three/drei 10.7.7.** Helpers used by the scene: `Text`, `Outlines`, `Html`.
- **@react-three/postprocessing 3.0.4.** Bloom, scanline, noise, and vignette.
- **postprocessing 6.38.0.** Effect composer.

## State

- **Zustand 5.0.8.** Match state in `lib/store.ts` (players, cards, phases, combat). Client settings in `lib/settings-store.ts` (FPS cap, persisted).

## Styling

- **Tailwind CSS 4.1.17.** Utility classes and the tokens in `app/globals.css`.
- **tailwindcss-animate 1.0.7**, **tw-animate-css 1.3.3**, **tailwind-merge 3.4.0**, **class-variance-authority 0.7.1**, **clsx 2.1.1**.

## Installed UI packages

These packages are in `package.json`. The match UI is the HTML overlay in `components/game/ui.tsx`. `sonner` is mounted from `app/layout.tsx`. The rest of this list is installed and is not what the table plays.

- **Radix UI primitives.** Accordion, alert dialog, aspect ratio, avatar, checkbox, collapsible, context menu, dialog, dropdown menu, hover card, label, menubar, navigation menu, popover, progress, radio group, scroll area, select, separator, slider, slot, switch, tabs, toast, toggle, toggle group, tooltip.
- **Lucide React 0.454.0.**
- **sonner 1.7.4.**
- **vaul 1.1.2**, **cmdk 1.0.4**.
- **React Hook Form 7.66.1**, **@hookform/resolvers 3.10.0**, **Zod 3.25.76**.
- **uuid 13.0.0**, **date-fns 4.1.0**, **react-day-picker 9.8.0**, **embla-carousel-react 8.5.1**, **input-otp 1.4.1**, **react-resizable-panels 2.1.9**, **recharts 2.15.4**, **next-themes 0.4.6**.
- **@vercel/analytics 1.3.1**.

## Build

- **PostCSS 8.5.6**, **autoprefixer 10.4.22**, **@tailwindcss/postcss 4.1.17**.
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

The scene mixes materials:

- Deck meshes use `meshToonMaterial`.
- Units and the table use `meshStandardMaterial` and `meshBasicMaterial`.
- Outlines on the deck and on units.
- Bloom, scanlines, film-grain noise, and a vignette.

Colors in the prototype:

- Player 1, on the 3D units and decks: `#00f0ff`.
- Player 2, on the 3D units and decks: `#ff0055`.
- The HTML card modal uses Tailwind `cyan-500` and `pink-500` borders.
- Deck trim: `#c9a227`. Table inlay: `#d4af37`. Cost badge: `#eab308`.
- Table felt: `#207050`. Rail: `#804010`.

## Prototype rules

These are the rules in `lib/store.ts` and `lib/card-data.ts`. Both players use one screen. Play alternates by phase.

### Resources

- Deployment Points (DP) pay for cards.
- Both players start at 1 DP, with a maximum of 1.
- Unspent DP does not carry. A player is refilled to their current maximum at the start of their phase.
- After combat results are dismissed, both maximums increase by 1, capped at 10. Player 1 is refilled to the new maximum immediately. Player 2 is refilled to it when their phase starts.
- Generated costs stop at 9, so the tenth point of maximum cannot be required by a card.

### Cards

- Stats are HP, attack damage, DP cost, and tags.
- The generator builds one list of 26 cards from the 26 entries in `lib/weapons.json`. Each player gets that list shuffled, with new ids. The two decks have the same names and the same stats.
- The first nine cards in the shuffled weapon list cost 1 through 9. Their HP and attack are random, and each tag lowers the stats those points would otherwise buy. The other seventeen cards roll HP and attack from 1 to 9, then set a cost from that total plus the tag count, clamped to 1 through 9.
- Tags used by the generator: Air, Armor, Structure, Infantry, Stealth, Support, Heavy.
- Opening hand is 5, taken from the front of the deck. Maximum hand size is 5.
- A player draws one card when their hand is below 5 and the deck is not empty. Player 2 draws when Player 1 ends the phase. Player 1 draws when combat results are dismissed. The opening hand is already 5, so that first draw is skipped until a card leaves the hand.

### Board and turns

- Each player has 4 columns and 2 rows, eight cells. A card can be played on any empty cell on that player's side during that player's phase, if they can pay.
- Phases: Player 1, Player 2, then an end phase that resolves combat. The turn number increases when the combat results are dismissed.
- In combat, every unit on both sides deals its attack in one pass. Damage is applied before any defeat is removed, so a unit reduced to 0 health still deals its damage in that resolution.
- A unit damages the first unit in the enemy's field list that shares its column. Both of your units in that column hit that same enemy. A second enemy in the column is not hit. The row is not a target order.
- A unit with no enemy in that column deals no damage. There is no commander to strike.
- A defeated unit is removed from the field and appended to the bottom of that player's deck at full HP. Draws come off the front. The card is not shuffled back in.
- `winner` stays null. The match does not end.

### What this build does not do

No Doomsday Clock, no Chips, no commander health, no Black File abilities, no authored legend roster, and no online opponent. A defeated prototype unit is appended to the bottom of its owner's deck at full health. The design instead shuffles a killed card into the draw pile, and it adds a graveyard and capture, which this build does not have.
