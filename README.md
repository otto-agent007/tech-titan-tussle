# Tech Titan Tussle

A one-on-one pixel-art fighting game for the browser. Pick from four fighters (TECHNOKING, SCAM ALTMAN, Captain · Pop T and TEFLON DON) and fight on Mars or the Moonbase, against the CPU or a second player.

The game is plain TypeScript drawing to a 320×224 canvas. It has no runtime dependencies.

## Play

```
npm install
npm run dev        # http://localhost:5173
```

| | Player 1 | Player 2 |
| --- | --- | --- |
| Move | A / D | ← / → |
| Jump | W | ↑ |
| Light | J | , |
| Heavy | K | . |
| Special | L | / |

Space pauses, R restarts the round, T switches the opponent between CPU and a second player, and G changes difficulty. A standard controller works too: left stick or D-pad to move, face buttons to attack, Start to pause and Back to restart. Every control also has an on-screen button.

## Build and test

```
npm run check      # lint, typecheck, unit tests, production build
npm run test:e2e   # Playwright browser tests against the production build
npm run arcade:validate
```

The Python art tools in `tools/assets/` need the packages in `tools/requirements.txt`.

## Development pages

With `npm run dev` running:

- `/dev/arcade.html` is the fighter playground. It overlays hit and hurt boxes and lets you live-edit `src/game/marsArcadeTuning.json` (walk speed, jump, damage, stun and more).
- `/dev/gym.html` is the character gym. It edits every clip's drawings, holds and boxes in `src/game/marsArcadeAnimations.json`, and corrects sprite art.

The workflow for adding or changing an animation is in `.agents/skills/arcade-animation/SKILL.md`.

## Layout

| Path | Contents |
| --- | --- |
| `src/game/` | Fight rules, fighters, animation table, HUD, stage and sound cues; no rendering |
| `src/dev/` | Canvas renderer, input, sprites and effects, plus the playground and gym |
| `src/arcade/` | Game page entry and the Web Audio player |
| `art-source/arcade/` | Source art, prompts and candidates for every fighter and backdrop |
| `runtime-art/arcade/` | The exact PNGs the production build ships |
| `public/audio/mars-arcade-v1/` | Game sounds; see `CREDITS.txt` |
| `art-source/audio/` | Sound sources, licenses and the generator |
| `asset-reports/` | Sprite contract, frame prompt pack and audio notes |
| `tools/` | Animation validator, sprite normalisers and gates, browser checks |

## Credits

The sound effects are edited from CC0 recordings by Independent.nu/qubodup, Jordan Irwin (AntumDeluge), artisticdude and Kenney. Full details are in `public/audio/mars-arcade-v1/CREDITS.txt`.

Fighters are affectionate cartoon caricatures. This is a non-commercial fan project, and it is not endorsed by anyone it depicts.
