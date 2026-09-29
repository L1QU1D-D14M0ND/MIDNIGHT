# Mechanics

> **Status: design rules.** This is how a match of MIDNIGHT is meant to be played. It is not implemented. The playable build is [Project stack](project-stack.md). The setting is [World](world.md). The legend files are [Cards](cards.md).
>
> Chip cost, health, and attack on individual legends are still unassigned. Mundane assets (infantry through nukes) do not have cards yet.

## Web app

This game is a web app, played online against another player.

## Match setup

- The clock starts at **5 to Midnight**.
- Each commander starts at **30** health.
- Each player has a 30-card draw pile, shuffled.
- Each player draws an opening hand of 5.
- Before the first turn, each player may mulligan once: shuffle the hand back into the draw pile and draw 5. A player cannot mulligan twice.
- The players choose who is Player 1. Player 1 takes the first turn.
- **Black File** cards are unique: one copy in a deck. Any other asset is limited to three copies.
- Mundane assets are not designed yet. The clock table below is their clearance guide until those cards exist.

## Board

The table has **four lanes**, shared by both players. A lane is a column.

Each player has **one slot** in each lane. A player may have one unit in a lane. The opposing unit in that same lane is the enemy in that lane, not an adjacent unit.

**Adjacent** means the next lane to the left or the right. Adjacency does not cross the table to the other player.

### Zones

| Zone | What it holds |
| --- | --- |
| Command | The commander. This is a health total, not a card. |
| Hand | Cards a player can deploy. Maximum 7. |
| Draw pile | Face-down cards that player draws from. |
| Field | Units in lane slots. |
| Orbital dock | Orbital units. They do not use a lane slot. |
| Graveyard | Exiled cards. |
| Capture | Cards held unusable by a capturing effect. |

## Turn, round, and clock tick

A **turn** is one player's phases. A **round** is Player 1's turn plus Player 2's turn.

On your turn, in this order:

1. **Upkeep.** Start-of-turn damage and other "at the start of your turn" abilities. Resolve them one at a time.
2. **Draw.** Draw one card. If your hand already has 7 cards, skip the draw. If the draw pile is empty, the draw fails and you get no card.
3. **Chips.** Refill your Chips to your current maximum.
4. **Main.** Deploy cards and use activated abilities, in any order, as many times as you can pay for.
5. **Combat.** Your units attack, one unit at a time, in the order you choose.
6. **End.** End-of-turn abilities, one at a time.

The minute hand advances **one minute at the end of every second round**, after Player 2's end phase, before Player 1's next turn. The clock starts at 5, so the first automatic advance happens after round 2, from 5 to 4.

## Chips

Chips are the currency. They pay for deployments and for activated abilities that print a Chip cost.

- Both players start at **1 Chip**, with a maximum of **1**.
- Unspent Chips do not bank. At the start of your turn, during the Chips phase, your Chips become your current maximum.
- At the end of each round, both maximums increase by **1**, to a cap of **10**. On a round when the clock also advances, the clock moves first, then the maximums increase.
- A deployment spends the card's Chip cost.
- An activated ability spends the Chip cost printed on it.
- An ordinary attack is free, unless a card says the attack costs Chips.

## Decapitation Strike

The match ends immediately when a commander's health is **0 or lower**. That player loses. There is no other victory. An empty draw pile does not lose the game. The clock reaching Midnight does not end the game. Midnight is when the all-out war starts.

### Sequential resolution

Damage, healing, kills, and other effects happen **one at a time**, in the order they are caused. After each instance, check both commanders.

The first commander to reach 0 loses, and the match ends before the next instance is applied. A single effect does not damage two commanders in one step. When a card would damage both commanders, damage the opponent's commander first, then your own, and stop if the match has already ended. A card that cannot be ordered this way is a design bug and has to be rewritten. The rules do not have a tie.

### Targeting the commander

During combat, a unit's attack targets the enemy unit in its lane. If that lane has no enemy unit, the attack may target the enemy commander.

An area effect or a one-shot deals damage only to units, unless its own text says it deals damage to a commander. Panopticon's Midnight liquidation says it deals commander damage, so it can. White Knight's Rod from God does not, so it cannot.

A unit that does not attack, including a Structure and an Orbital, does not strike the commander by occupying or shadowing a lane. A Structure in a lane still counts as the enemy unit in that lane, so it blocks commander strikes in that lane.

### Casualty, exile, and capture

**Casualty.** A killed card is shuffled into its owner's draw pile. It can be drawn again. Killing a card does not put it in a separate discard pile. Sacrifice is a kill: the sacrificed card is a casualty and returns to its owner's draw pile, unless the effect exiles it instead.

**Exile.** An exiled card is put into its owner's graveyard. It stays there until an effect says it leaves. Discard does this too: a discarded card is exiled to the graveyard. Exile is not a kill, and a kill is not an exile.

**Capture.** A captured card is unusable. It is not in the draw pile, the hand, the field, or the graveyard. It does nothing until an effect frees it. The freeing effect says where the card goes. If an effect says only that the card is freed, it returns to its owner's hand. If the effect kills the captured card, the card is freed and then becomes a casualty: it is shuffled into its owner's draw pile.

Captured cards and exiled cards are not shuffled back by a death. They move only when an effect moves them.

## The Doomsday Clock

Embedded in the mahogany at the top center of the table is a vintage analog clock. Only the last minutes are marked. A heavy black minute hand ticks with a mechanical clack. The face has six segments.

The names of those segments, from the start of the match to the end, are:

**5 to Midnight, 4 to Midnight, 3 to Midnight, 2 to Midnight, 1 to Midnight, Midnight.**

A card is stamped with one of those six names. It may be deployed when the clock is on its stamp or further toward Midnight. A card stamped **5 to Midnight** may be deployed immediately. A card stamped **Midnight** may be deployed only at Midnight, unless Breach of Protocol is used from 1 to Midnight.

| Time | Defcon | Narrative state | Authorized mundane assets |
| --- | --- | --- | --- |
| 5 to Midnight | Blue | Cold War | Infantry, spies, light spec-ops |
| 4 to Midnight | Green | Skirmish | Light vehicles (jeeps), transport, support |
| 3 to Midnight | Yellow | Conflict | Main battle tanks, attack choppers |
| 2 to Midnight | Orange | War | Heavy artillery, strategic bombers, naval support |
| 1 to Midnight | Red | Crisis | Experimental units, chemical and bio weapons |
| Midnight | Black | Doomsday | Tactical nukes, omega units |

Richelieu's unleashed state is a 5-to-Midnight legend ability. Scharnhorst's unleashed state is a Midnight legend ability. Those names live on their cards. They are not extra clock steps.

If a card in hand is earlier than the clock allows, and Breach cannot legally play it, the card is shown locked: greyed out, with a locked overlay.

### Breach of Protocol

You may deploy a card stamped exactly **one minute** further toward Midnight than the clock.

1. Pay **twice** that card's Chip cost.
2. Advance the clock one minute. Both players are now on the new minute.
3. The card enters.

You cannot breach by more than one minute. From 5, a jeep stamped **4 to Midnight** can be breached. A tank stamped **3 to Midnight** cannot. From 1, a Midnight card can be breached: the clock becomes Midnight, then the card enters.

Example. The clock is at 5. You breach a jeep stamped 4. You pay twice its Chip cost, the clock moves to 4, and the jeep enters. Your opponent may now deploy their own 4-stamped cards as well.

### When the clock moves backward

The clock moves forward unless a card says it moves backward. When a card does move it backward:

- A unit whose stamp is further toward Midnight than the new time is **disabled**. It cannot attack or use activated abilities.
- It still occupies its slot, and it still blocks commander strikes in its lane.
- If that disabled unit is attacked, the clock advances to that unit's stamp before it retaliates. This happens once for that attack, and both players share the new time. The unit may then retaliate.

### Scheherazade

While Scheherazade is on the board, the clock **cannot enter Midnight**. The automatic tick stops at 1 to Midnight. A Breach declared from 1 also stops at 1, the double Chip cost is not paid, and the Midnight card is not deployed. Her card repeats this lock and does not grant an exception.

If a disabled Midnight unit is attacked while she is on the board, the retaliation advance stops at 1. That unit stays disabled and does not retaliate.

## Card types and tags

**Black File** is a supertype, not a weapon tag. A Black File legend is unique.

`TAGS: [NONE]` on a legend means it has no weapon tag. The parenthetical in the file, such as `(Black File / Orbital Assassin)`, is a role label for authors. It is not a rules tag.

A legend gains a rules tag only where its text says it is that tag. Panopticon, Pandora, and Gehenna say they are **Structure**. White Knight and Black Knight are **Orbital**.

Rules tags are: **Infantry, Armor, Air, Heavy, Structure, Support, Stealth, Orbital.**

| Type | Meaning |
| --- | --- |
| Asset | A unit in a lane slot. |
| Structure | An asset that does not move and does not make ordinary attacks, unless its text says it does. It still occupies its slot and blocks the commander. |
| Orbital | Deploys into the orbital dock, and only at Midnight (or by a legal Breach from 1). On deploy, it chooses one lane to shadow. It does not fill that lane's slot and does not, by itself, block the commander. |
| Tactic | A one-shot with no body. Older card text that says "spell" means tactic. |

A mundane asset's stamp is the minute that authorizes it in the clock table. A legend's stamp is the stamp in its stat block.

## Abilities and priority

| Word | Meaning |
| --- | --- |
| Passive | A static ability. It is on while the card is in play and its conditions are met. |
| Activated ability | An ability a player chooses to use, paid for if it has a cost. Card text that says "active ability" means this. |
| Triggered ability | An ability that happens when its event occurs. |
| Deployment effect | An ability that happens as the card enters, before it can be chosen as an attacker. |
| Tactic | A one-shot card with no body. "Spell" in older sentences is a tactic. |

When several effects want to happen at the same moment, apply them in this order. Inside each step, the active player's effects happen first, then the opponent's, and each effect finishes before the next one starts.

1. **Cannot** beats **can**. A prohibition wins over a permission.
2. Prevention and negation, such as Black Knight's point defense or a cancelled Breach.
3. Offensive Midnight abilities.
4. Defensive Midnight abilities.
5. Sacrifice and self-destruct, including damage those effects deal to allied units.

## Deployment

A deployed unit may act on the turn it entered, unless a card says it enters exhausted or cannot act.

## Speech

Character speech is floating text. Deployment, ability, and death may have sound effects. There is no voice acting. Lines in [Cards](cards.md) labeled as voice lines are the floating-text script.

## Still open

These are not rules yet, and this document does not invent them:

- Chip cost, health, and attack for each legend. The stat blocks in [Cards](cards.md) mark those fields unassigned.
- The mundane roster. The clock table is only a clearance guide.
- Setting questions in [World](world.md): whether Karras is another name for Scharnhorst. Enterprise is the carrier's codename. A legend whose clearance is stamped Majestic-12 temporarily belongs to that faction; the stamp is a placeholder, not a rules tag. Affiliation is not a rules tag.
