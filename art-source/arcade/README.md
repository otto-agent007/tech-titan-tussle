# Fighter art — sprite source

This folder holds the source art for every fighter, effect and backdrop: raw generator output, normalised cells, retired candidates and the prompts that produced them.

## Runtime copies

The game uses 184 referenced runtime PNGs. Byte-identical copies live under `runtime-art/arcade/`. The production build reads only those copies and emits them at the canonical `/art-source/arcade/` URLs, so the build never ships the larger source tree. Whenever you change equipped art, update the matching copy in `runtime-art/arcade/`.

## Animation table and clip tools

Every clip is described once, in `src/game/marsArcadeAnimations.json`. Each drawing has its path, pose name, phase, hold in engine frames, and the body, hurt, attack and guard boxes drawn on it. The harness plays from the table, `/dev/gym.html` edits it, and `npm run arcade:validate` checks it, including each box against its drawing's silhouette. Frames are keyed by drawing, not by position. The full procedure is in `.agents/skills/arcade-animation/SKILL.md`.

- `tools/assets/normalise-arcade-clip.py` normalises a clip's sources together, using one alignment: `feet`, `planted-foot`, `torso`, `bbox` or `preserve-canvas`. In `feet` mode it produces the same bytes as `normalise-popt-frame.py` for the same inputs.
- `tools/assets/audit-arcade-clip.py` measures a clip as a sequence: pops between drawings, feet leaving the baseline, and height or torso drift across cycles. It writes a contact sheet, a GIF at the table's holds, and `review.md` under `preview-renders/mars-arcade/clips/`.
- `tools/assets/pick-arcade-frames.py` chooses N drawings from an image-to-video clip. It skips the settle, spreads the picks evenly and rejects duplicates.

## Layout

```
art-source/arcade/
  prompts/            ready-to-send prompt text, assembled from the prompt pack
  <fighter>/
    generated/        raw generator output, untouched
    normalised/
      <clip>/         <clip>-NN.png in the 128x128 contract cell
```

`<fighter>` is `booster`, `oracle`, `captain` or `trump`. The sprite contract is `asset-reports/mars-arcade-sprite-contract.json`, and the generation process is `asset-reports/mars-arcade-frame-prompt-pack.md`.

## Generating

Use Codex CLI's built-in `image_gen` only. Never set `OPENAI_API_KEY`.

```
codex exec -C <repo> -s workspace-write \
  - < art-source/arcade/prompts/anchor-booster.txt
```

To keep a fighter's identity, attach its approved anchor drawing with `-i <anchor.png>`.

## Normalising and gating

Derive each fighter's scale **once**, from that fighter's own anchor, then reuse it for every frame of that fighter. Re-fitting per frame makes the character change size between clips.

```
CONTRACT=asset-reports/mars-arcade-sprite-contract.json

# once per fighter - prints the scale to lock in
python3 tools/assets/normalise-popt-frame.py \
    art-source/arcade/booster/generated/anchor-00.png /tmp/probe.png \
    --contract $CONTRACT --derive-scale

# every frame thereafter, with that printed value
python3 tools/assets/normalise-popt-frame.py \
    art-source/arcade/booster/generated/anchor-00.png \
    art-source/arcade/booster/normalised/anchor/anchor-00.png \
    --contract $CONTRACT --source-px-per-cell-px <locked value>

python3 tools/assets/check-popt-frames-fullcolour.py \
    --contract $CONTRACT art-source/arcade/booster/normalised
```

The check was tested in both directions: a correct 104 px frame passes, while a short frame, a floating frame and a frame with leftover `#FF00FF` are each rejected.

Airborne and knocked-down poses have no foot span on the baseline. Normalise those with `--align bbox` and record the offset once per clip.

## Locked scales

| Fighter | source px per cell px | Derived from |
| --- | --- | --- |
| booster | 14.0385 (1460 / 104) | `booster/generated/wardrobe-sleek/anchor-00.png` (likeness anchor) |
| oracle | 13.6058 (1415 / 104) | `oracle/generated/anchor-likeness-00.png` (likeness anchor) |
| captain | 13.9904 (1455 / 104) | `captain/generated/anchor-00.png` |

Normalise every runtime cell of a fighter at that fighter's value. Never re-derive it per frame or per clip.
