# Common cards

> **Status: design roster, started.** These cards are not in the playable build. The rules are [Mechanics](../mechanics.md). The Black File legends stay in [Cards](../cards.md).

Common cards are the mundane assets. A deck has 30 cards. It may contain eight copies of each common card, and at most two Black File cards. Those two must be different legends. A legend is still one copy.

A common card has a stamp, a chip cost, health, and attack. Those numbers are assigned here. Legend stat blocks stay unassigned.

A common card has a stage effect only when its own file says so. The effect is decided on that card. **Early** is the stage written for the start of the clock. **Late** is the stage written for closer to Midnight. Janus's False Narrative tells the unit to use the other stage of this effect. It does not change the stamp, and it does not rewrite a legend.

The clock table in Mechanics is the clearance guide. This directory does not include experimental units, chemical or bio weapons, or tactical nukes.

The prototype generates 26 hardware names in `lib/weapons.json`, with random stats. The names that already match a written common, or that share one role with each other, are one card. The rest of the fitting names are written below. The build still generates the old stats. These files are the authored versions.

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
| [Pantsir-S1](pantsir.md) | 4 to Midnight | Armor, Support | None. |
| [Attack Chopper](attack-chopper.md) | 3 to Midnight | Air | Standard Scaling. Chip cost drops late. |
| [Main Battle Tank](main-battle-tank.md) | 3 to Midnight | Armor, Heavy | None. |
| [Stealth Fighter](stealth-fighter.md) | 3 to Midnight | Air, Stealth | None. |
| [Eurofighter Typhoon](typhoon.md) | 3 to Midnight | Air | None. |
| [AC-130J Ghostrider](ghostrider.md) | 3 to Midnight | Air, Heavy | None. |
| [Field Gun](field-gun.md) | 2 to Midnight | Heavy | None. |
| [M142 HIMARS](himars.md) | 2 to Midnight | Support, Heavy | None. |
| [B-21 Raider](raider.md) | 2 to Midnight | Air, Stealth, Heavy | None. |
| [Strategic Battery](strategic-battery.md) | 2 to Midnight | Structure, Heavy | None. |

## Recycled from the prototype

| Prototype name | Where it went |
| --- | --- |
| AH-64 Apache | [Attack Chopper](attack-chopper.md). Same role. |
| M1A2 Abrams, Leopard 2A7, T-14 Armata, Challenger 3, Merkava Mk 4 | [Main Battle Tank](main-battle-tank.md). Same tags, one card. |
| F-35 Lightning II, Su-57 Felon | [Stealth Fighter](stealth-fighter.md). |
| Phalanx CIWS | [Iron Dome](iron-dome.md). Both are point-defense mounts. |
| MIM-104 Patriot, Aegis Ashore, THAAD Battery | [Strategic Battery](strategic-battery.md). |
| FGM-148 Javelin, RQ-4 Global Hawk, Switchblade 600, M2 Bradley, M1126 Stryker, V-22 Osprey, MQ-9 Reaper, Iron Dome, Pantsir-S1, Eurofighter Typhoon, AC-130J Ghostrider, M142 HIMARS, B-21 Raider | Their own files, above. |

## Not recycled

**TOS-1A Solntsepek.** The prototype tags it Armor and Heavy, like a tank. The weapon is a thermobaric rocket launcher. This directory does not include the chemical row of the clock table, so the name stays out.
