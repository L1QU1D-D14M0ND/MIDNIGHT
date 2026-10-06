# Common cards

> **Status: design roster, started.** These cards are not in the playable build. The rules are [Mechanics](../mechanics.md). The Black File legends stay in [Cards](../cards.md).

Common cards are the mundane assets. A deck has 30 cards. It may contain eight copies of each common card, and at most two Black File cards. Those two must be different legends. A legend is still one copy.

A common card has a stamp, a chip cost, health, and attack. Those numbers are assigned here. Legend stat blocks stay unassigned.

A common card has a stage effect only when its own file says so. The effect is decided on that card. **Early** is the stage written for the start of the clock. **Late** is the stage written for closer to Midnight. Janus's False Narrative tells the unit to use the other stage of this effect. It does not change the stamp, and it does not rewrite a legend.

The clock table in Mechanics is the clearance guide. This directory does not include experimental units, chemical or bio weapons, or tactical nukes.

The prototype generates 26 hardware names in `lib/weapons.json`, with random stats. Each name that fits the clock table is its own common card, in basic form: stamp, cost, health, attack, and tags. The build still generates the old stats. These files are the authored versions. The real names plus the six older bodies are enough for a 30-card deck, so no extra invented cards were added.

## Cards

| Card | Stamp | Tag | Stage effect |
| --- | --- | --- | --- |
| [Rifle Squad](rifle-squad.md) | 5 to Midnight | Infantry | Standard Scaling. +1 Attack late. |
| [Scout](scout.md) | 5 to Midnight | Stealth | Inverse Scaling. Reads the enemy deck early. |
| [FGM-148 Javelin](javelin.md) | 5 to Midnight | Infantry, Heavy | None. |
| [RQ-4 Global Hawk](global-hawk.md) | 5 to Midnight | Air, Support | Inverse Scaling. Reads your deck early. |
| [Switchblade 600](switchblade.md) | 5 to Midnight | Air, Stealth | None. |
| [Jeep](jeep.md) | 4 to Midnight | — | None. |
| [Supply Truck](supply-truck.md) | 4 to Midnight | Support | None. |
| [M2 Bradley](bradley.md) | 4 to Midnight | Armor, Support | None. |
| [M1126 Stryker](stryker.md) | 4 to Midnight | Armor, Support | None. |
| [V-22 Osprey](osprey.md) | 4 to Midnight | Air, Support | None. |
| [MQ-9 Reaper](reaper.md) | 4 to Midnight | Air, Support | None. |
| [Iron Dome](iron-dome.md) | 4 to Midnight | Structure, Support | None. |
| [Phalanx CIWS](phalanx.md) | 4 to Midnight | Structure, Support | None. Basic form. |
| [Pantsir-S1](pantsir.md) | 4 to Midnight | Armor, Support | None. |
| [Attack Chopper](attack-chopper.md) | 3 to Midnight | Air | Standard Scaling. Chip cost drops late. |
| [AH-64 Apache](apache.md) | 3 to Midnight | Air, Heavy | None. Basic form. |
| [M1A2 Abrams](abrams.md) | 3 to Midnight | Armor, Heavy | None. Basic form. |
| [Leopard 2A7](leopard-2a7.md) | 3 to Midnight | Armor, Heavy | None. Basic form. |
| [T-14 Armata](armata.md) | 3 to Midnight | Armor, Heavy | None. Basic form. |
| [Challenger 3](challenger-3.md) | 3 to Midnight | Armor, Heavy | None. Basic form. |
| [Merkava Mk 4](merkava.md) | 3 to Midnight | Armor, Heavy | None. Basic form. |
| [F-35 Lightning II](f-35.md) | 3 to Midnight | Air, Stealth | None. Basic form. |
| [Su-57 Felon](su-57.md) | 3 to Midnight | Air, Stealth | None. Basic form. |
| [Eurofighter Typhoon](typhoon.md) | 3 to Midnight | Air | None. |
| [AC-130J Ghostrider](ghostrider.md) | 3 to Midnight | Air, Heavy | None. |
| [Field Gun](field-gun.md) | 2 to Midnight | Heavy | None. |
| [M142 HIMARS](himars.md) | 2 to Midnight | Support, Heavy | None. |
| [B-21 Raider](raider.md) | 2 to Midnight | Air, Stealth, Heavy | None. |
| [MIM-104 Patriot](patriot.md) | 2 to Midnight | Structure, Heavy | None. Basic form. |
| [Aegis Ashore](aegis-ashore.md) | 2 to Midnight | Structure, Heavy | None. Basic form. |
| [THAAD Battery](thaad.md) | 2 to Midnight | Structure, Heavy | None. Basic form. |

## Not recycled

**TOS-1A Solntsepek.** The prototype tags it Armor and Heavy, like a tank. The weapon is a thermobaric rocket launcher. This directory does not include the chemical row of the clock table, so the name stays out.
