# Changelog

Newest first. Every version from 1.0.0 is grouped by category. `README.md` shows only the latest three versions. 中文：[CHANGELOG.zh.md](./CHANGELOG.zh.md)。

Entries come from git history, tags, and GitHub Releases.

## 1.0.3 — 2026-10-05

### Security

- Publish `ysk-omni` from GitHub Actions with npm Trusted Publishing (OIDC) and a provenance attestation. The release workflow does not use an npm token.

### Internal/CI

- `.github/workflows/release.yml` runs the test suite on a version tag, publishes that version when it is not already on the registry, checks `npm view ysk-omni@<version>`, and creates one GitHub Release.
- `README.md` and `README-ZH.md` list only the latest three versions, grouped by category. `CHANGELOG.md` and `CHANGELOG.zh.md` keep every version from 1.0.0.
- Development docs record this changelog rule.
- CI and the release workflow use GitHub Actions on the Node 24 runtime (`actions/checkout@v7`, `actions/setup-node@v7`, `softprops/action-gh-release@v3`). The publish job runs on Node 24.

GitHub Release: https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.3

## 1.0.2 — 2026-09-28

### Improvements

- Finish remaining Admin strings for eight languages (`683a52f`)
- Translate Admin strings 600–799 into eight languages (`8f77c6e`)
- Translate Admin strings 400–599 into eight languages (`03c1bc3`)
- Translate Admin strings 200–399 into eight languages (`dfebb9e`)
- Translate first 200 Admin strings into eight languages (`e891f6d`)

### Internal/CI

- Bump the package version, update fixtures, and rebuild the Admin bundle so the sidebar shows v1.0.2 (`03b3b1b`)

GitHub Release: https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.2
Compare: https://github.com/yanshekki/ysk-omni/compare/v1.0.1...v1.0.2

## 1.0.1 — 2026-09-27

### New features

- Show app version above the Admin logout button (`29f4a34`)
- Redesign Admin language picker as a custom dropdown (`c322086`)
- Admin language picker with 11 locales and Traditional/Simplified Chinese (`7d10af6`)
- Add Admin Business partnership page (`9688907`)

### Fixes

- Skip documentElement in Node tests and release 1.0.1 (`7eef3f9`)

### Internal/CI

- Wipe dist before tsc so stale build artifacts are not packed (`e127ae9`)

GitHub Release: https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.1
Compare: https://github.com/yanshekki/ysk-omni/compare/v1.0.0...v1.0.1

## 1.0.0 — 2026-09-24

Listed commits run from `ee0ffa8` through tag `v1.0.0`. Earlier commits are the imported lineage recorded by that commit, and are not repeated here as 1.0.0 changes.

### New features

- GET /v1/models lists usable models for the API key (`5109fd9`)
- Restrict API keys to an allowed model list (`4f7c252`)
- Chat playground generates image, video, speech, STT (`b553f7c`)
- Real Zeroscope text-to-video instead of stills (`0449ec4`)
- Output format picker and stronger on-device media weights (`784ce4d`)
- Pull whisper and diffusion Hub weights (`2e00254`)
- Speech and transcribe modes in Media studio (`869db34`)
- Tiny OpenAI media worker and live modality tests (`72c460d`)
- Uninstall runtimes from Admin and CLI (`eda5122`)
- One-click runtime install via brew, pip, winget, Docker (`202807e`)
- Admin Runtimes page with per-OS install commands (`cb7979a`)
- Catalog download queue with percent, speed, and ETA (`4dbd96f`)
- Show estimated disk MB and VRAM on Hub catalog rows (`ad0dab2`)
- Catalog runnable-only Hub, delete local, pull-by-path, CLI (`408f958`)
- Sync top 50 Hub GGUF ids into Catalog without downloading (`06ce4c4`)
- Search Hugging Face Hub from Admin Catalog (`0b6bf90`)
- Restyle Admin Catalog to match KPI + tabs pages (`175f530`)
- Ship a demo OpenAI-shaped media worker (`18fb831`)
- Llama GPU layers env and vLLM python -m spawn fallback (`7012f7b`)
- Serve a playable ffmpeg H.264 mp4 as the video job fixture (`9103d74`)
- STT file proxy, ftyp video fixture, doctor reads engines.json (`1a57d0e`)
- Persist vLLM serve and proxy OpenAI chat (`f98b23c`)
- Keep llama-server loaded and proxy streaming chat (`d5978e2`)
- Proxy pulled GGUF chat through llama-server (`695602b`)
- Exclusive VRAM unload when a video job starts (`bd32fa1`)
- Ship Admin Catalog in the production boot.js SPA (`6bd027c`)
- Enable image, audio, and video APIs by default (`e422594`)
- Admin Catalog, VRAM LRU scheduler, and doctor VRAM (`9b13112`)
- Queue video jobs and complete with fixture bytes (`50ac51c`)
- Image and audio 501 unless OMNI worker URL is set (`6fc3114`)
- Echo chat engine and OpenAI models pull route (`7af0b6c`)
- Curated catalog, Hub client, and model CLI (`2954ad2`)
- Add local model registry.json upsert (`56caf16`)
- Parse Hugging Face specs and pick GGUF quants (`2c6b871`)
- Stop spawning the previous CLI; return engine_unconfigured (`a7d4dbf`)

### Improvements

- Purge internal product identifiers from the gateway (`bd2b5a2`)

### Fixes

- Delete Hub snapshot dirs and unblock Ubuntu CI (`4bf5468`)
- Drop leftover product copy from System software and product copy (`2051ab8`)
- Hong Kong written Chinese Admin copy, align English (`7d5bbd0`)
- Drop leftover product copy from the Admin UI (`ee68f53`)
- Classify Zeroscope Hub pulls as video, not image (`7759499`)
- Skip SDXL root weight dumps when unet/ exists (`2a94467`)
- Piper tiny voice uses lessac-low Hub path (`c550c2c`)
- Serve Admin index with cache-bust so Runtimes nav loads (`d14015b`)
- Catalog Hub pager matches other pages and keeps scroll (`63580ad`)
- Hide Catalog queue when a Pull downloads nothing (`2337290`)
- Keep Catalog Pull progress when switching tabs (`016223e`)
- Only keep local models that actually have a GGUF file (`a5521ab`)
- Catalog Pull progress uses a bar instead of raw bytes (`6cc143e`)
- Show Hub size and VRAM in a single unit (`7810019`)
- Split Catalog Hub search and path-Pull into two toolbars (`76f64c5`)
- Type Hub Link header as string | string[] (`d821975`)
- Default playground chat model to a loaded GGUF (`1bc24ba`)
- Skip a second SSE init when queued llama chat streams (`8202326`)
- Share omniHome() and proxy queued chat to llama-server (`f76c493`)
- Admin playground defaults to echo instead of the previous default model (`8903394`)
- Hash pulled GGUFs and skip failed Hub downloads in registry (`5ead97f`)
- Encode Hugging Face org and repo separately (`5bb8749`)
- Use valid identifiers after ysk-omni rebrand (`b1ad035`)

### Internal/CI

- Release 1.0.0 with CI and npm publish workflow (`c84c8ee`)
- Rewrite manuals, full CLI reference, and agent skills (`5cd6cd7`)
- Drop an obsolete binary path from the Chinese README env table (`a2abbe6`)
- Remove obsolete plan files (`d37326a`)
- Rigorous live SDXL, whisper-large, Piper-high, real video (`3d4272c`)
- Hong Kong written Chinese in Admin, align English (`6393f22`)
- Mark leftover CLI surfaces and default the model to echo (`a880874`)
- Comfy OpenAI-compat note, PM2 start, drop obsolete CLI product copy (`0424b0e`)
- Rebrand the project identity to YSK Omni (`cfd0541`)
- Import the previous gateway as the YSK Omni lineage (`ee0ffa8`)

GitHub Release: https://github.com/yanshekki/ysk-omni/releases/tag/v1.0.0
Commits: https://github.com/yanshekki/ysk-omni/commits/v1.0.0
