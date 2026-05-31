# LUMIQ 🌟

> A guidance portal bringing the world's knowledge to everyone — one beautiful chunk at a time.

**Live SPA** → `https://vabjosh.github.io/lumiq`

---

## What's in here

```
lumiq/
├── src/
│   ├── morning-agent.js     # 7:00 AM — inspiring quote + reflection
│   └── evening-agent.js     # 7:00 PM — positive news + paired quote
├── spa/
│   └── src/App.jsx          # Dashboard + Pinterest Feed + Calendar
├── content/
│   ├── feed.json            # Auto-updated by agents daily
│   └── posts/               # Per-day JSON archives
└── .github/workflows/
    ├── daily-agents.yml     # Cron: runs agents at 7am & 7pm UTC
    └── deploy-spa.yml       # Auto-deploys SPA on every push
```

---

## Setup (one time, ~30 min)

### 1. Create GitHub repo
- Go to github.com → New repository → name it `lumiq`
- Push this code to it

### 2. Add Secrets
Settings → Secrets & Variables → Actions → New secret:

| Secret | Where |
|--------|-------|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `X_BEARER_TOKEN` | developer.twitter.com |
| `X_API_KEY` | developer.twitter.com |
| `X_API_SECRET` | developer.twitter.com |
| `LINKEDIN_ACCESS_TOKEN` | linkedin.com/developers |
| `LINKEDIN_PERSON_URN` | Your LinkedIn profile ID |
| `INSTAGRAM_ACCESS_TOKEN` | developers.facebook.com |
| `INSTAGRAM_ACCOUNT_ID` | Instagram Business Account ID |

> Start with just `ANTHROPIC_API_KEY` — agents skip missing platforms gracefully.

### 3. Enable GitHub Pages
Settings → Pages → Source: **GitHub Actions**

### 4. Push to main
Everything runs automatically from here.

---

## Your live URLs
- **SPA**: `https://vabjosh.github.io/lumiq`
- **Feed JSON**: `https://vabjosh.github.io/lumiq/feed.json` (read by portal)

## Cost
| Item | Monthly |
|------|---------|
| Domain (lumiq.app) | ~$1.20 |
| GitHub Actions | $0 |
| Anthropic API | ~$0.50 |
| **Total** | **~$1.70** |

---

*Built with ♥ for LUMIQ — the belief that understanding is a human right.*
