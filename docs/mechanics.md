# Mechanics

> **Status: design sketch, unfinished.** These rules are not implemented. The playable build is [Project stack](project-stack.md). The setting is [World](world.md). The legend files are [Cards](cards.md).
>
> The rules below are the sketch as written, including contradictions. Decisions required to finish the sketch are collected at the end and are not rules yet.

## Web app

This game will be developed in a web app to be played online against other players.

## Decapitation Strike

The Rule: The game ends IMMEDIATELY when a Commander’s (player’s) Health is reduced to 0 or lower.

Clarification: There are no other victory conditions. You cannot win by "decking out" the opponent, nor by reaching a specific time limit. You must kill the head of the snake.

The Commander (player) has a max life of 30 at the start of the game, and a unit can only target the commander if there are no enemy units on the same lane, most area attacks and one-shot effects can’t target the commander under any circumstance.

## Escalation

### SYSTEM: THE DOOMSDAY CLOCK

### 1. Visual Representation

Embedded in the rich mahogany of the poker table (top center) is a vintage, analog Doomsday Clock.

- The Face: a full clock, only the last numbers are written on it.
- The Hand: A heavy, jagged black minute hand. It doesn't sweep smoothly; it ticks with a loud, mechanical CLACK that vibrates the table.
- The Zones: The arc is divided into 6 Segments (Minutes).

### 2. The Minutes (Escalation Levels)

Instead of "Levels," the game measures progress in "Minutes to Midnight." Each minute authorizes a specific tier of weaponry.

| Time | Defcon | Narrative State | Authorized Assets |
| --- | --- | --- | --- |
| 5 to Midnight | Blue | Cold War | Infantry, Spies, Light Spec-Ops (Richelieu Unleashed) |
| 4 to Midnight | Green | Skirmish | Light Vehicles (Jeeps), Transport, Support. |
| 3 to Midnight | Yellow | Conflict | Main Battle Tanks, Attack Choppers. |
| 2 to Midnight | Orange | War | Heavy Artillery, Strategic Bombers, Naval Support. |
| 1 to Midnight | Red | Crisis | Experimental Units, Chemical/Bio Weapons. |
| MIDNIGHT | Black | Doomsday (theme game doesn’t end, but the all out war starts) | Tactical Nukes, Omega Units (Scharnhorst Unleashed). |

### 3. How Time Passes

The clock is the heartbeat of the match. It moves in two ways:

### A. Inevitable Drift (The Turn Timer)

War is momentum. It is hard to stop once it starts.

- Mechanic: the Minute Hand advances 1 Minute automatically every 2 Rounds (after both players have acted twice).
- Pacing: this ensures that even if players play passively, the game will eventually reach the endgame (Midnight).
- Scheherazade: her passive “The 1001st Night” stops the clock from reaching MIDNIGHT.

### B. "Breach of Protocol" (The Gamble)

This is the core tactical risk. You can play a card that is 1 level higher than the current Time, but you must force the clock forward to do it.

- The Scenario: It is 5 to Midnight (Infantry only). You have an M1 Abrams Tank (Requires 4 to Midnight) in your hand.
- The Action: You declare a "Breach."
- The Cost:
  - You pay twice the Chip cost of the Tank.
  - You manually advance the Clock by 1 minute maximum. (Moving from 5 to 4 = 1 Minutes).
- The Consequence:
  - You get your Tank out early (advantage).
  - BUT: You have just unlocked Level 4 Assets for your opponent as well. You escalated the war for them.

### 4. Card Design: Clearance Levels

Every Asset card has a "Time Stamp" in the top right corner, styled like a classified document stamp.

- Infantry Card: Stamped [-5] (Playable immediately).
- Tank Card: Stamped [-3] (Playable at 3 to Midnight).
- Nuke Card: Stamped [00] (Playable only at Midnight).

Units deployed are disabled (don’t do anything) if the conflict deescalates below their deployment time, but if they are attacked the clock advances to allow them to fire back. They still block attacks against the commander though.

Visual Note: If a card is currently "Restricted" (e.g., it's a Tank but the clock is at Infantry level), the card appears "Greyed Out" or covered by a digital "Locked" overlay in the player's hand.

## Chips

The main resource of the game, needed to deploy assets and used as currency.

## MIDNIGHT effects

Normally, offensive type MIDNIGHT abilities take priority over defensive type MIDNIGHT abilities.

Self-destructing effects that cause damage to allies occur after other effects take action.

Self-destructing and Sacrifice take priority over allied defense effects.

## Infinite Loop

The Rule: If a player attempts to Draw a Card from an empty Deck:

1. Shuffle the entire Casualty Pile (Discard Pile).
2. Place it face-down to form a New Deck.
3. Continue the Draw action normally.

Tactical Implication: Assets are never truly lost unless they are Exiled (Removed from Game).

## Deployment

Deployed units don’t suffer any sort of “summon sickness", they may act in the same turn they were deployed unless an external effect blocks them from doing so.

## Character interactions

Cards (mostly Black File units) will talk to each other, there will be no voice acting so all will be floating text.

## Mechanical Priorities

“Cannot” effects take priority over “Can” effects.

## Recommendations to finish this document

This section is not rules. The sections above are the design sketch as written. The items below are the decisions that sketch still needs before [Cards](cards.md) can be implemented. A suggested default is a proposal. It becomes a rule only when it is written into the sections above and this note is removed.

Finish the items in this order. Later cards assume the earlier decisions.

### 1. Board, lanes, and zones

The commander rule says a unit may strike the commander only when its lane is empty. Lane count, slots per lane, and adjacency are never defined. Pandora buffs adjacent units. Black Knight does not sit in a lane; it docks and casts a shadow on one.

Write a board section that states:

- How many lanes exist, and whether a lane is a column shared by both players.
- How many units each player may have in one lane.
- What "adjacent" means.
- The zones: command (the commander is a health total, not a card), hand, deck, field, casualty, exile, capture (tucked under a card such as Panopticon), and orbital dock.

Suggested default: four shared lanes, matching the prototype grid in [Project stack](project-stack.md). Each player may occupy one slot per lane. Adjacent means the next lane to the left or right. An orbital unit occupies the dock and chooses one lane to shadow. It does not fill that lane's slot, so it does not block the commander by itself.

### 2. Turn, round, and the clock tick

"The minute hand advances 1 minute every 2 rounds (after both players have acted twice)" uses round and turn without definitions.

Write:

- A **turn** is one player's sequence of phases.
- A **round** is Player 1's turn plus Player 2's turn.
- The automatic clock tick happens at the end of every second round, before the next Player 1 turn.
- The phase order inside a turn. Suggested default: upkeep (start-of-turn damage and "at the start of your turn" abilities), draw, gain Chips, main (deploy and activate), combat, end.

Say whether both players attack in one shared combat step or each player attacks on their own turn. The prototype resolves both sides together at the end of the round. The lane rule reads more cleanly if each player attacks during their own turn, into the enemy units currently in that lane.

### 3. Chips

The Chips section is one sentence. Cards already spend Chips (White Knight's Rod from God costs 2) and tax them (Scheherazade makes enemy attacks cost +1 Chip).

Write the numbers:

- Starting Chips and the maximum.
- When Chips are gained, and whether unspent Chips bank.
- Which actions spend them: deploy, activated abilities, attacks, or some combination.

Suggested default, so there is a known curve while the card files are costed: same shape as prototype Deployment Points. Start at 1, maximum increases by 1 at the end of each round, cap 10, refill to the maximum at the start of your turn, unspent Chips do not bank. Deploy costs the card's Chip cost. Activated abilities spend what the card says. Ordinary attacks are free unless a card says otherwise.

### 4. One clock vocabulary

The escalation table, the breach example, and the stamp list disagree.

| Source | What it says about a tank |
| --- | --- |
| Escalation table | Main battle tanks are authorized at 3 to Midnight. Light vehicles are authorized at 4. |
| Breach example | An M1 Abrams requires 4 to Midnight, played while the clock is at 5. |
| Stamp list | A tank is stamped [-3], playable at 3 to Midnight. An infantry card is [-5]. A nuke is [00]. |

Pick one set of names and use it on every card: `5`, `4`, `3`, `2`, `1`, `Midnight`. Suggested default: keep the table, change the Abrams example to a light vehicle at 4 or a tank at 3, and replace `[-5]` / `[-3]` / `[00]` with those six names. `[-5]` reads as "five minutes to Midnight" only if the reader already knows the joke.

Also name the asset each minute actually authorizes, as the table does, and point at the future mundane roster. [Cards](cards.md) is only Black File legends. Infantry, jeeps, tanks, bombers, and nukes have no files. This document should say the table is a clearance guide until that roster exists.

### 5. Breach of Protocol

State the procedure in one place:

- You may deploy a card whose stamp is exactly one minute later than the current time.
- You pay twice its Chip cost.
- The clock advances one minute, for both players, before the card enters.
- You cannot breach by more than one minute.
- A card stamped Midnight can be breached onto the table only from 1 to Midnight.

Suggested default: that is the whole rule. The breach example should use a card whose stamp matches the table.

### 6. Whether the clock can move backward

Deployed units "are disabled if the conflict deescalates below their deployment time." Nothing in the base rules moves the clock backward, so the disable rule has no trigger until a card creates one.

Suggested default: the clock only moves forward unless a card says it moves backward. When a card does move it backward:

- A unit whose stamp is later than the new time cannot attack or use activated abilities.
- It still occupies its lane and still blocks the commander.
- If that unit is attacked, the clock advances to its stamp before it retaliates. This happens once per attack, and it advances the clock for both players.

Write that procedure into the clock section. Delete the single sentence that currently carries the whole rule, and replace it with the procedure.

### 7. Scheherazade and Midnight

This document says her passive stops the clock from reaching Midnight. Her card says Breach still works, and the next sentence says a Breach that would reach Midnight stays stuck at 1. Those cannot all be true.

Suggested default: while Scheherazade is on the board, nothing reaches Midnight. The automatic tick stops at 1. A Breach declared from 1 also stops at 1, and a Midnight-stamped card cannot be deployed. Her "this state is impossible while she lives" line and the dealer note both describe that lock. Delete "Breach Protocol still works" from her card when the rules are updated.

The other candidate is a soft lock: the timer cannot enter Midnight, but a paid Breach can. Choose the hard lock or the soft lock in this document, then make her card repeat that sentence and no other.

### 8. Combat and the commander

Replace "most area attacks and one-shot effects can't target the commander."

Suggested default:

- A unit attack may target the enemy unit in the same lane.
- If that lane has no enemy unit, the attack may target the commander.
- An area effect or one-shot deals damage only to units, unless its text says "deal damage to the commander."
- Panopticon's Midnight liquidation says it deals commander damage, so it is allowed under this default. White Knight's Rod from God does not, so it is not.
- Commander health starts at 30. At 0 or below, that player loses immediately, in the middle of the effect that dealt the damage.
- If one effect would reduce both commanders to 0, the player who controls that effect wins. If a game rule with no controller does it, the match is a draw.

Also define damage, death, and where the body goes: casualty by default, exile when a card says removed from the game, capture when a card says tucked under another card. Captured and exiled cards are not part of the casualty pile, so they are not shuffled back by the empty-deck rule.

### 9. One Midnight priority order

The three sentences under MIDNIGHT effects disagree about self-destruct. "Cannot" over "can" is a separate section. Fold both into one stack and delete the old sentences.

Suggested order, first to last:

1. **Cannot** beats **can**. A prohibition wins over a permission.
2. Prevention and negation (Black Knight's point defense, a cancelled Breach).
3. Offensive Midnight abilities.
4. Defensive Midnight abilities.
5. Sacrifice and self-destruct, including damage those effects deal to allied units.

Define the words cards already use: passive, activated ability, triggered ability, spell, tactic, deployment effect. Black Knight negates "the first Spell, Tactic, or Active Ability" that targets it. Those types need a definition or that line cannot be played.

### 10. Tags and card types

Every legend is stamped `TAGS: [NONE]`, and the body then says the unit is a `[STRUCTURE]`, `[ORBITAL]`, `[INFANTRY]`, or similar. The prototype tag list and the design are not the same list.

Suggested default:

- **Black File** is a supertype, not a weapon tag. Legends are unique.
- `TAGS: [NONE]` means the card has no weapon tag. The parenthetical, such as `(Black File / Orbital Assassin)`, is a role label for authors, not a rules tag.
- When a card says it "is a [STRUCTURE]" (or Air, Armor, Infantry, Heavy, Support, Stealth, Orbital), that word is a rules tag other cards can name.
- Weapon tags that mechanics text is allowed to use: Infantry, Armor, Air, Heavy, Structure, Support, Stealth, Orbital.
- A normal asset's clearance comes from the clock table. A Black File's clearance is the stamp printed on it.

Add four card types, because the files already assume them:

- **Asset** — a unit on a lane.
- **Structure** — an asset that does not move or make ordinary attacks, unless its text says it does.
- **Orbital** — deploys only at Midnight, into the dock.
- **Tactic** — a one-shot with no body. "Spell" in older sentences means tactic.

### 11. Deck, hand, and the missing roster

Write deck size, opening hand, maximum hand, mulligan, and copy limits.

Suggested default: 30-card deck, opening hand 5, maximum hand 7, one mulligan (shuffle back and draw 5). Black File cards are limited to one copy. Other assets are limited to three. An empty deck still reshuffles the casualty pile, as already written. If the casualty pile is also empty, the draw fails and the player takes no card.

Do not invent the non-legend roster inside this file. Add one sentence: mundane assets are not designed yet; the clock table is their clearance guide.

### 12. Speech, sound, and the stat block

This document says characters are floating text and there is no voice acting. The card template asks for spoken deployment, ability, and death lines.

Suggested default: character speech is floating text. Deployment, ability, and death may have sound effects. Nobody is voiced. The "voice line" fields in [Cards](cards.md) are the floating-text script.

Add a stat block to the card template, and then to every legend, once the items above exist:

| Field | Example |
| --- | --- |
| Chip cost | 4 |
| Stamp | 3 to Midnight |
| Health | 6 |
| Attack | 3 |
| Tags | Structure |
| Supertype | Black File, unique |
| Type | Asset |

Until those numbers exist, the legend files are art, lore, and ability prose. They are not playable cards.

### Definition of done

This document is finished when a reader can resolve a turn without inventing a number, and when each item below has one answer in the rules above:

- Lane count, slots, adjacency, and the zone list.
- Turn, round, phase order, and the exact moment the clock ticks.
- Chip starting value, income, cap, banking, and what spends them.
- One stamp vocabulary, with the Abrams example matching the table.
- Breach procedure, including a one-minute limit.
- Clock direction, and the disabled-unit procedure if it can move backward.
- Scheherazade: hard lock or soft lock, repeated on her card.
- Commander targeting, commander-damage exceptions, and both-commanders-die.
- Casualty, exile, and capture.
- One priority order, plus definitions for passive, activated, triggered, and tactic.
- Tag list and the four card types.
- Deck size, hand size, copy limits.
- Floating text versus sound effects.
- A stat block on the template in [Cards](cards.md).

Two canon notes belong in [World](world.md), not here, but they leak into these rules. World says the only confirmed Majestic-12 member is Black Knight, and that other Majestic-12 stamps are placeholders. White Knight, Enterprise, Scheherazade, and Janus are stamped Majestic-12 anyway. Scheherazade's dialogue names Yorktown; the carrier in the card file is Enterprise. World also calls Scharnhorst by the name Karras. Settle those in the world file before treating affiliation as a mechanical trait.
