# Selected fighting-game audio

Owner decision: **Heavy hitters**, followed by explicit authorization of the announcer and all character specials. Original statements and exact source/runtime hashes are in `art-source/audio/arcade-fight-candidates-v2-2026-11-03/SELECTION.json`.

## Source and runtime contract

Twenty 48 kHz mono/16-bit WAVs, **1,147,322 bytes**, are copied unchanged to `public/audio/mars-arcade-v1/`: three jabs, two heavy punches, two low-kick impacts, two blocks, one miss, one guard break, one knockdown, four signatures and four announcer clips. Audition demo mixes and unselected sets are excluded. Source → runtime → production-build bytes/hashes match for all twenty; source files and generator remain recoverable. Runtime `CREDITS.txt` includes authors, CC0 licensing and edits.

Recorded layers: Independent.nu/qubodup punches, AntumDeluge thwacks, artisticdude swishes, Kenney fighter announcer. Canonical pages, original filenames, archive/source hashes and included CC0 license text are preserved in `sources.json` and `sources/` beside the audition generator. Edits: trim, resample/pitch, EQ, contact/body/air layers, dynamics and endpoint fades. Signatures add original synthesis; the flyby is synthesized engine/air. No paid API, new production dependency, cloned voice or analytics.

## Playback and controls

`marsArcadeSfx.ts` maps pure combat events to clips; `MarsArcadeSfxPlayer` owns Web Audio and bounded overlap. The rules emit one `moveActive` cue at the first active frame of an accepted move, preserving state/tuning. Real connects select impacts, guarding selects block, a miss supplies air, and a special plays once rather than once per rendered frame or cap projectile. Light/heavy/kick/block variants rotate deterministically. Three landed hits by one side within 60 combat frames of each other earn one Combo call; blocks, gaps and terminal outcomes break the streak. Human wins get a delayed victory line; CPU wins and draws do not.

Native Start unlocks sound. Sound on/off and volume persist separately from game progress/Moonbase. Pause, mute, selection, return, page hiding and disposal stop nodes and invalidate pending playback. Stale downloads do not replay old impacts, and announcer generations prevent old calls replacing newer ones. Eight-node bound and a dynamics compressor control overlap. Missing/blocked/unavailable audio preserves all combat and exposes retry. The development art/tuning harness remains silent.

## Approval

The owner played the integrated version and said **“Worked goo for me, good job!”** on 2026-11-04. This is scoped approval of the in-game sounds, in addition to the earlier candidate selection.
