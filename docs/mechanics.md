# Mechanics

> **Status: design rules.** This is how a match of MIDNIGHT is meant to be played. It is not implemented. The playable build is [Project stack](project-stack.md). The setting is [World](world.md). The legend files are [Cards](cards.md). The first common cards are in [Common cards](common/README.md).
>
> Chip cost, health, and attack on individual legends are still unassigned, except the numbers a file already states. The rest of the mundane roster is still open.

## Web app

This game is a web app, played online against another player.

## Match setup

- The clock starts at **5 to Midnight**.
- Each commander starts at **30** health.
- Each player has a 30-card draw pile, shuffled.
- Each player draws an opening hand of 5.
- Before the first turn, each player may mulligan once: shuffle the hand back into the draw pile and draw 5. A player cannot mulligan twice.
- The players choose who is Player 1. Player 1 takes the first turn.
- A deck may include at most **2** Black File cards. Those two must be different legends. A legend is still unique: one copy of that card, and not two copies of the same legend.
- Any other asset is a common card and is limited to **8** copies.
- The common cards are in [Common cards](common/README.md). The clock table below is the clearance guide for mundane assets that do not have a file yet.

## Board

The table has **five lanes**, shared by both players. A lane is a column.

Each player has **two slots** in each lane. The slot closer to the enemy is the **front** slot. The slot farther from the enemy is the **back** slot. Those slots are that player's front row and back row. A player may have one unit in each of their own slots.

**In front** of a unit is the other slot in its lane, closer to the center of the table. **Behind** a unit is the other slot in its lane, farther from the center. A card may call the back row the backline. The enemy backline in a lane is the enemy back slot in that lane.

**Adjacent** means the next lane to the left or the right, on the same side of the table. Adjacency does not cross to the other player, and it does not mean the unit in front or behind. "Two slots away" means two lanes to the left or the right.

A unit moves **forward** only when a card says it does. Forward is from that player's back slot to that player's front slot in the same lane. If the front slot is occupied, the card has to say what happens to the unit already there.

During combat, a unit's attack targets the enemy front unit in its lane. If that front slot is empty, the attack targets the enemy back unit in that lane. If both enemy slots in that lane are empty, the attack may target the enemy commander. The unit behind a target is the unit in that lane's slot farther from the center than the target. If the target is already in a back slot, nothing is behind it.

### Zones

| Zone | What it holds |
| --- | --- |
| Command | The commander. This is a health total, not a card. |
| Hand | Cards a player can deploy. Maximum 7, unless a card changes it. |
| Draw pile | Face-down cards that player draws from. |
| Field | Units in lane slots. |
| Orbital dock | Orbital units. They do not use a lane slot. |
| Graveyard | Exiled cards. |
| Capture | Cards held unusable by a capturing effect. |

## Turn, round, and clock tick

A **turn** is one player's phases. A **round** is Player 1's turn plus Player 2's turn.

On your turn, in this order:

1. **Upkeep.** Start-of-turn damage and other "at the start of your turn" abilities. Resolve them one at a time.
2. **Draw.** Draw one card. If your hand is already at its maximum, skip the draw. The maximum is 7 unless a card changes it. If the draw pile is empty, the draw fails and you get no card.
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
- A card that grants Chips adds them. A start-of-turn grant is added after the Chips-phase refill. Any other grant is added when the card says. Granted Chips can rise above the maximum. They are spent normally. The next Chips phase still sets Chips to the maximum, so the extra does not bank and does not raise the maximum. Richelieu, Gehenna, and Enterprise grant Chips. Richelieu's file says +1 Chip every turn while the clock is at **5 to Midnight**, **4 to Midnight**, or **3 to Midnight**, and it does not name the phase. Gehenna grants Chips equal to half the sacrificed unit's Chip cost, rounded up, when that unit is sacrificed. Enterprise grants +1 Chip per turn while Submerged, on the **5 to Midnight** row of its file.
- A card that changes hand size changes the maximum used by the draw step. Shadow Company raises that maximum by 2 while the clock is at **5 to Midnight**, **4 to Midnight**, **3 to Midnight**, or **2 to Midnight**.

## Decapitation Strike

The match ends immediately when a commander's health is **0 or lower**. That player loses. There is no other victory. An empty draw pile does not lose the game. The clock reaching Midnight does not end the game. Midnight is when the all-out war starts.

### Sequential resolution

Damage, healing, kills, and other effects happen **one at a time**, in the order they are caused. After each instance, check both commanders.

The first commander to reach 0 loses, and the match ends before the next instance is applied. A single effect does not damage two commanders in one step. When a card would damage both commanders, damage the opponent's commander first, then your own, and stop if the match has already ended. A card that cannot be ordered this way is a design bug and has to be rewritten. The rules do not have a tie.

### Targeting the commander

During combat, a unit's attack follows the lane order in Board: the enemy front slot, then the enemy back slot, then the enemy commander when both of those slots are empty.

An area effect or a one-shot deals damage only to units, unless its own text says it deals damage to a commander. Panopticon's Midnight ability, Total Eradication, says it deals commander damage, so it can. The ability named Liquidation Protocol is at **1 to Midnight** and heals your own commander. It does not damage the enemy commander. White Knight's Rod from God does not deal commander damage, so it cannot.

A unit that does not attack, including a Structure and an Orbital, does not strike the commander by occupying or shadowing a lane. A unit in either enemy slot of a lane still blocks commander strikes through that lane.

### Casualty, exile, and capture

**Casualty.** A killed card is shuffled into its owner's draw pile. It can be drawn again. Killing a card does not put it in a separate discard pile. Sacrifice is a kill: the sacrificed card is a casualty and returns to its owner's draw pile, unless the effect exiles it instead.

**Exile.** An exiled card is put into its owner's graveyard. It stays there until an effect says it leaves. Discard does this too: a discarded card is exiled to the graveyard. Exile is not a kill, and a kill is not an exile.

**Capture.** A captured card is unusable. It is not in the draw pile, the hand, the field, or the graveyard. It does nothing until an effect frees it. The freeing effect says where the card goes. If an effect says only that the card is freed, it returns to its owner's hand. If the effect kills the captured card, the card is freed and then becomes a casualty: it is shuffled into its owner's draw pile.

Captured cards and exiled cards are not shuffled back by a death. They move only when an effect moves them.

## The Doomsday Clock

Embedded in the mahogany at the top center of the table is a vintage analog clock. Only the last minutes are marked. A heavy black minute hand ticks with a mechanical clack. The face has six segments.

The names of those segments, from the start of the match to the end, are:

**5 to Midnight, 4 to Midnight, 3 to Midnight, 2 to Midnight, 1 to Midnight, Midnight.**

These six names are the only names for the clock. Write them as **5 to Midnight**, **4 to Midnight**, **3 to Midnight**, **2 to Midnight**, **1 to Midnight**, and **Midnight**. A heading may capitalize a name: "5 TO MIDNIGHT" means **5 to Midnight**.

Do not write "minutes to Midnight," "5-to-Midnight," "5-3," "2-0," or "Escalation Clock." The clock is the Doomsday Clock. There is no step called 0. After **1 to Midnight** comes **Midnight**.

"Or closer" means the named step and every step further toward Midnight. A range names the steps: "**5 to Midnight**, **4 to Midnight**, or **3 to Midnight**."

A card is stamped with one of those six names. It may be deployed when the clock is on its stamp or further toward Midnight. A card stamped **5 to Midnight** may be deployed immediately. A card stamped **Midnight** may be deployed only at Midnight, unless Breach of Protocol is used from 1 to Midnight.

| Time | Defcon | Narrative state | Authorized mundane assets |
| --- | --- | --- | --- |
| 5 to Midnight | Blue | Cold War | Infantry, spies, light spec-ops |
| 4 to Midnight | Green | Skirmish | Light vehicles (jeeps), transport, support |
| 3 to Midnight | Yellow | Conflict | Main battle tanks, attack choppers |
| 2 to Midnight | Orange | War | Heavy artillery, strategic bombers, naval support |
| 1 to Midnight | Red | Crisis | Experimental units, chemical and bio weapons |
| Midnight | Black | Doomsday | Tactical nukes, omega units |

Richelieu's unleashed state is a **5 to Midnight** legend ability. Scharnhorst's unleashed state is a **Midnight** legend ability. Those names live on their cards. They are not extra clock steps.

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

**Black File** is a supertype, not a weapon tag. A Black File legend is unique. A deck holds at most two of them, and they have to be two different legends.

`TAGS: [NONE]` on a legend means it has no weapon tag. The parenthetical in the file, such as `(Black File / Orbital Assassin)`, is a role label for authors. It is not a rules tag. Affiliation is not a rules tag. A Majestic-12 clearance stamp is a temporary faction placeholder, described in [World](world.md).

A legend gains a rules tag only where its text says it is that tag. Panopticon, Pandora, and Gehenna say they are **Structure**. White Knight and Black Knight are **Orbital**.

Rules tags are: **Infantry, Armor, Air, Heavy, Structure, Support, Stealth, Orbital.**

| Type | Meaning |
| --- | --- |
| Asset | A unit in a lane slot. |
| Structure | An asset that does not move and does not make ordinary attacks, unless its text says it does. It still occupies its slot and blocks commander strikes through that lane. |
| Orbital | Deploys into the orbital dock, and only at Midnight (or by a legal Breach from 1). On deploy, it chooses one lane to shadow. It does not fill either slot in that lane and does not, by itself, block the commander. |
| Tactic | A one-shot with no body. |

A mundane asset's stamp is the minute that authorizes it in the clock table. A legend's stamp is the stamp in its stat block.

### WMDs

A WMD is a tactical nuke or other doomsday weapon. The Midnight row of the clock table is what authorizes tactical nukes. A legend is a WMD only when its own text says so. While Black Knight is deployed, WMDs are disabled for both players, and Black Knight counters a WMD that would resolve anyway. Scharnhorst is immune to WMDs at Midnight. His card states that immunity. Terminal Intercept names WMDs. The Air tag keeps its own rules.

## Abilities and priority

| Word | Meaning |
| --- | --- |
| Passive | A static ability. It is on while the card is in play and its conditions are met. |
| Activated ability | An ability a player chooses to use, paid for if it has a cost. Card text that says "active ability" means this. |
| Triggered ability | An ability that happens when its event occurs. |
| Deployment effect | An ability that happens as the card enters, before it can be chosen as an attacker. |
| Tactic | A one-shot card with no body. |

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

- Chip cost, health, and attack for each legend. The stat blocks in [Cards](cards.md) mark those fields unassigned, except where a file states a number. Caliban's base health is 4 and his base attack is 0. Richelieu's penalty at **1 to Midnight** sets her to 1 health and 1 attack.
- The mundane rows that still have no file: experimental units, chemical and bio weapons, and tactical nukes. [Common cards](common/README.md) has the first six and the prototype hardware that fits an earlier row. TOS-1A Solntsepek is not recycled. A stage effect is written on that unit's own card. Rifle Squad, Scout, Attack Chopper, and Global Hawk have one. The others in that directory do not.
- Scharnhorst counts as Infantry for positive Infantry effects and not for negative ones. Bradley's Dismount is a positive Infantry effect. The other effects are not sorted yet.
- Black Knight counters and disables WMDs. That role is settled. The rest of its sheet is still the old orbital layout and is not settled.
- Legend files that still use one row per clock step do not say whether a new row replaces the earlier rows or stays on with them. Scharnhorst's Protocol says his lines stay on. The other tables do not, so those rows are not a settled rule.
- Scheherazade's Time Bubble calls Richelieu, Rio, and Terminus Inverse Scaling and tells them to treat the clock as **3 to Midnight**. Inverse Scaling is defined for a common card's own stage effect. Those three files have no Early and Late stages, so the bubble does not yet say which of their abilities stay on.
- Acheron's Corrosion amount is stated only on the **4 to Midnight** row, as 1 damage. The core line used to call the amount an escalation level. The clock has no such number. His **5 to Midnight** row says he has 0 attack while the Dead Zone is off.
- Richelieu's +1 Chip says "every turn" and does not name the phase.
- Some older files use a 50% chance, and names that are not rules tags: Haste, Rush, Shields, Armor as a number, Morale, Fear, Pierce, and similar. The rules tags are the eight listed above. Those other names are not rules until this document defines them.
