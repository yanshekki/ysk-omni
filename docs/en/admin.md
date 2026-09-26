# Admin panel

URL: `http://127.0.0.1:3850/admin/`

Production SPA: `admin/src/full/app.js` → `public/admin/boot.js` (`npm run build:admin`). Languages: English and Hong Kong written Chinese.

## Login

```bash
ysk-omni admin otp
```

Enter the code on the login page. Codes expire in five minutes and work once. The panel does not keep a live API key in the browser.

Disable the panel (CLI only to re-enable):

```bash
ysk-omni admin off
ysk-omni admin on
```

## Pages

| Nav | Purpose |
|-----|---------|
| Dashboard | KPI, health |
| Chat | Playground. Loaded GGUF preferred. Media models generate image/video/speech in the thread |
| Chat logs | Encrypted request history |
| API keys | Create / edit: role, mode, rate, IP allowlist, **allowed models** |
| Documents | Uploaded files |
| Media | Studio: image, video, speech, transcribe; library |
| Catalog | Hub search, pull queue, local models, Load / Unload / delete |
| Runtimes | Per-OS install / uninstall of llama-server, ffmpeg, … |
| Audit | Audit log |
| Safety | Global safe mode, default model |
| API features | Protocol and media flags |
| Usage | Limits and usage |
| DDoS | Policy, bans |
| Queue | Pause, drain, jobs |
| PM2 | Process manager |
| System | Software (Node, npm, llama-server, ffmpeg, PM2, Prisma), package update, env |
| Support | Author and sponsorship |
| Business | Enterprise deploy, OEM, integration, partners |

After deploying a new `boot.js`, hard-refresh the browser.
