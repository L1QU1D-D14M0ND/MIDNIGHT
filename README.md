# MIDNIGHT

A browser card game played on a 3D poker table. The repository runs an early prototype. The setting, rules, and legend roster for the intended game are the design documents.

## Documentation

| Document | Status | What it covers |
| --- | --- | --- |
| [Project stack](docs/project-stack.md) | Current playable prototype | Stack, code layout, and the rules the app implements |
| [World](docs/world.md) | Design, unfinished | Elisabeth and Majestic-12 |
| [Mechanics](docs/mechanics.md) | Design rules, not in the build | Commander, Doomsday Clock, Chips, lanes, and card flow |
| [Cards](docs/cards.md) | Design | Card template and 23 Black File legends |
| [Common cards](docs/common/README.md) | Design, started | Mundane assets. Up to eight copies. The first six, plus hardware recycled from the prototype. |

The prototype and the design documents describe different games. The build uses Deployment Points, a shared grid, and generated hardware cards. The design uses Chips, a 30-health commander, a Doomsday Clock, and named Black File units. Those systems are not in the build. Where a design document and [Project stack](docs/project-stack.md) disagree, the running game follows the project stack.

## Run the prototype

```bash
npm install
npm run dev
```

`npm run build` builds the Next.js app. `npm run lint` calls `eslint .`. ESLint is not installed, and the repository has no ESLint config, so that script fails.
