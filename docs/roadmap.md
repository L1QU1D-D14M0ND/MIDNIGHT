# Roadmap

**Status: not started.** The playable build is [Project stack](project-stack.md). These steps make that build play [Mechanics](mechanics.md) and the commons in [Common cards](common/README.md).

Each step should leave `npm run dev` playable. When a step lands, update Project stack so it still describes the build.

These steps stop at the common cards. Black File legends stay in [Cards](cards.md) until their chip costs, health, and attack are assigned. A deck of commons is already legal. Online play is a later track. Two players stay on one screen until the local match matches the rules.

## 1. Authored decks

Replace the generator in `lib/card-data.ts`. Load each common file's stamp, chip cost, health, attack, tags, and type. Stop rolling stats from `lib/weapons.json`.

A match uses a 30-card deck and at most 8 copies of each common. No Black File cards yet. Both players can share one fixed deck made of the **5 to Midnight** cards, which can be paid for at the opening maximum of 1 Chip.

`weapons.json` can stay as a name list. It is not the stat source.

## 2. Five lanes and the commander

Change `GRID_CONSTANTS`, `components/game/table.tsx`, and `components/game/scene.tsx` to 5 lanes. Each player has a front slot and a back slot. Front is the slot closer to the center.

In `lib/store.ts`, the active player's units attack one at a time. The target is the enemy front unit, then the enemy back unit, then the commander when both of those slots are empty. Apply one strike at a time. Each commander starts at 30 health. The first to reach 0 loses, and `winner` is set.

Shuffle a killed card into its owner's draw pile.

Add empty graveyard, capture, and orbital dock lists on each player. None of the commons put a card there yet.

## 3. Turns and Chips

Replace the shared end phase with one player's turn: Upkeep, Draw, Chips, Main, Combat, End. A round is Player 1's turn plus Player 2's turn.

The hand maximum is 7. The opening hand stays 5, so the first Draw happens.

Rename Deployment Points to Chips. Both maximums increase by 1 at the end of each round, after Player 2's end phase, capped at 10. A player refills to their maximum during their own Chips phase. Unspent Chips do not bank.

The HUD in `components/game/ui.tsx` shows the phase, both commanders, and Chips.

## 4. The Doomsday Clock

Add the six steps, starting at **5 to Midnight**. At the end of every second round, the clock advances one step, and then the Chip maximums increase.

A card can be deployed on its stamp or closer to Midnight. A card exactly one minute early can be breached: pay twice its Chip cost, advance the clock one step, then the card enters. A card further ahead than that is shown locked.

Put the clock on the table, at the top center.

## 5. Common abilities

Wire the text already written on the common files.

- Numbers and looks: Rifle Squad's late attack, Scout and Global Hawk in Upkeep, the Javelin's bonus against Armor, and the Switchblade becoming a casualty after it attacks.
- Main phase: Jeep and Stryker move forward, the Osprey moves Infantry, the Supply Truck restores 2 health, Bradley's infantry bonus, and the Strategic Battery's shot.
- Combat: Field Gun, HIMARS, Ghostrider, Pantsir, Iron Dome, and the rule that Infantry, Armor, and Heavy cannot target a Stealth Fighter or the B-21 Raider.
- Attack Chopper's early cost of 4 and late cost of 2.

Janus is a Black File, so these stage effects follow the real clock.

## 6. Match setup

Before the first turn, each player may mulligan once. The players choose who is Player 1.

## Later

Online play, so a deck look stays on one player's screen. Black File cards, after their numbers are assigned, into the two legend slots. Exile, capture, and orbitals already have a place on the player from step 2.
