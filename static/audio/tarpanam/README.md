# Tarpaṇam manual-mode audio

Drop MP3 files here and they'll auto-play once when the matching mantram
becomes current in Manual mode of `<TarpanamGuide />`.

## Naming

Files must be named **`step-NN.mp3`** where NN is the 1-based mantram index,
zero-padded to 2 digits:

- `step-01.mp3` — mantram 1 (moola mantram, 12 reps)
- `step-02.mp3` — mantram 2 (first bīja)
- `step-03.mp3` — mantram 3 (moola mantram, 4 reps)
- ...
- `step-NN.mp3` — mantram N

The full ordered list lives in `src/data/ganapatiTarpanam.js` (auto-generated
from the MDX Tarpaṇa section).

## Behavior

- Missing files fail silently — no MP3 for a step means "no audio for that step"
- Any playing clip is stopped when the reciter taps to the next mantram
- Audio ON/OFF toggle is inside the Manual fullscreen (bottom of screen)
- Files are served from `/audio/tarpanam/step-NN.mp3` (Docusaurus copies
  everything under `static/` to the site root)

## Recommended encoding

- Format: MP3, 44.1 kHz, 96–128 kbps mono
- Trim leading silence so playback feels instantaneous when a mantram changes
- Keep each clip short — a single recitation of the mantram is enough
