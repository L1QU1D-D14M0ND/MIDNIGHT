# Roadmap

**Status: not started.** The playable build is [Project stack](project-stack.md). These steps make that build play [Mechanics](mechanics.md) and the commons in [Common cards](common/README.md).

Each step should leave `npm run dev` playable. When a step lands, update Project stack so it still describes the build.

Black File legends stay in [Cards](cards.md) until their chip costs, health, and attack are assigned. A deck of commons is already legal. Online play stays later. Until then, Player 2 can be the bot in step 6.

## 1. Normal cards, basic form

The generator in `lib/weapons.json` already has real equipment names. Those names are the normal cards, one file each, with the tags they already carry. [Common cards](common/README.md) lists them. TOS-1A Solntsepek stays out: it is a thermobaric launcher, and this roster does not include the chemical row.

The six older bodies stay too: Rifle Squad, Scout, Jeep, Supply Truck, Field Gun, and Attack Chopper. Together with the prototype names, that is enough for a 30-card deck at 8 copies. No further invented cards until a clock row is actually empty.

In the build, replace `generateMasterDeck` in `lib/card-data.ts` with those files' stamp, chip cost, health, attack, tags, and type. A match deck is 30 cards, at most 8 of one common, and no Black File card. Both players can share one fixed deck of the **5 to Midnight** cards, which cost 1 Chip.

Special text on a file is not wired in this step. A card enters, sits in a slot, and attacks with its printed numbers.

## 2. Five lanes and the commander

This needs a layout pass before the rules change, because the table is already tight.

What is already there:

- Each player has 2 rows. In `components/game/table.tsx`, row 0 is the row closer to the center for both players. That row is the front slot. Row 1 is the back slot.
- `GRID_SIZE` is 4. Combat in `lib/store.ts` ignores the row and hits the first enemy in that column.

Plan:

1. Set `GRID_SIZE` to 5. `tableWidth` already grows with it. At `CELL_WIDTH` 2.4 the outer column reaches about x = 6, and the decks in `components/game/scene.tsx` also sit at x = 6. Move the decks out, or drop `CELL_WIDTH` toward 2, and then look at `components/game/camera-manager.tsx` from the default view and the selected-card view. The camera should still see all five lanes and both commanders.
2. Keep row 0 as front and row 1 as back. One unit per slot.
3. Add `commander` health to each player, starting at 30, drawn in `components/game/ui.tsx`.
4. When this player's units attack, resolve one unit at a time. Default order is front slots from lane 0 through lane 4, then back slots in that same lane order. The target is the enemy front unit in that lane, then the enemy back unit, then the commander if both enemy slots are empty. Stop the combat when a commander reaches 0 and set `winner`.
5. Shuffle a killed card into its owner's draw pile.
6. Add empty `graveyard`, `capture`, and `orbital` arrays on the player. No current common uses them. They are there so a later card does not have to reshape the player.

## 3. Turns and Chips

This loop is already in `lib/store.ts`. Keep it.

- Player 1 acts, then Player 2. Ending Player 1's phase refills Player 2 to their current maximum and draws if their hand is below the maximum.
- After the combat results are dismissed, both maximums rise by 1, capped at 10. Player 1 is refilled immediately. Player 2 is refilled when their phase starts. Unspent points do not carry past that refill.

That is the Chip rule, under the name Deployment Points. Rename `dp` and `maxDp` to Chips in the store and the HUD. Leave the timing.

The hand maximum is 5. Raise it to 7. The draw that already runs at the start of a phase is the Draw step, so the opening hand of 5 will draw.

The six design phases can be labels on this same loop. Main is the current phase, while cards are played. Combat is the current end phase. Upkeep and End can be empty passes until a card needs them. Do not build a second turn machine.

One difference remains, and it belongs with step 2: today both sides strike in the same combat. After the lanes exist, only the player who just finished their phase strikes.

## 4. Doomsday Clock

The clock is new. There is no timer in the build. Plan it as a small piece of state plus a lock on `playCard`, then a table object.

State, in `lib/store.ts`:

- A fixed list: **5 to Midnight**, **4 to Midnight**, **3 to Midnight**, **2 to Midnight**, **1 to Midnight**, **Midnight**. Store an index, 0 through 5. The match starts at 0.
- `round` increments when Player 2's phase ends, at the same moment the maximums are about to rise. On every even round, advance the index by one first, then raise the maximums. The first advance is after round 2.
- Nothing in this build stops the clock at **1 to Midnight**. Scheherazade is a Black File and is not in the deck.

Deploy check inside `playCard`:

- A card's stamp is an index in that same list. It can be played when its index is less than or equal to the clock index.
- If its index is exactly one higher, the play is a Breach: the player must have twice the printed Chip cost, the clock advances one step, then the card enters and the cost is paid.
- If its index is two or more higher, the card does not start a drag. `components/game/ui.tsx` draws it grey, with a lock.

Presentation:

- First, show the current name in the HUD, next to the Chip count. That is enough to test Breach and the lock.
- Then add the table clock: a short group at the top center of the felt, one dark hand, six marks. The hand angle is `index * 60` degrees. No new clock names, and no step past Midnight.

Chip costs that change with the clock, such as the Attack Chopper, wait for step 5. Until then the chopper uses its early cost.

## 5. Abilities, after the basic cards

Do this only once every common card is in the match as a body: stamp, cost, health, attack, tags, and type.

Then wire the text already on the files. Stage effects follow the real clock. Janus is a Black File and is not in the deck.

- Rifle Squad's late attack, Scout and Global Hawk during Upkeep, the Javelin's bonus against Armor, the Switchblade's casualty after it attacks, and the Attack Chopper's late cost.
- Jeep and Stryker move forward. The Osprey moves Infantry. The Supply Truck restores 2 health. Bradley's bonus is the positive Infantry effect.
- Field Gun, HIMARS, Ghostrider, and Pantsir change which unit is struck. Iron Dome and Phalanx reduce a hit. The F-35, the Su-57, and the B-21 Raider cannot be targeted by Infantry, Armor, or Heavy.
- Patriot, Aegis Ashore, and THAAD Battery gain the battery shot: 2 damage to an enemy Air unit in this lane or an adjacent lane.

## 6. A basic bot

Player 2 is a bot. It uses the same actions as a person: `playCard`, then `endPhase`.

- It does not mulligan, and it does not Breach.
- On its phase it plays the affordable, unlocked card with the lowest Chip cost into the first empty front slot, lanes left to right, then the back slots. If several cards tie, it plays the first one in hand.
- When no play is legal, it ends the phase.
- It does not use activated abilities. Those do not exist until step 5. After that, the bot still only plays bodies and attacks in the default lane order.
- A HUD toggle turns the bot off, and a second person plays on the same screen.

The human may mulligan once before the first turn. That prompt can ship with the bot. Choosing Player 1 can wait: the human is Player 1, and the bot is Player 2.
