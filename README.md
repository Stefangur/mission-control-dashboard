# Mission Control Dashboard

Real-time monitoring & control for Stefan's infrastructure.

## Features

✅ **System Status Overview** - Uptime, daemon status, versions
✅ **Render Apps Health** - 4 dashboards with deployment status
✅ **Local Daemons** - Ollama + Trader Daemon monitoring
✅ **Cron Jobs Schedule** - 08:00, 12:00, 18:00 briefings
✅ **Recent Alerts** - Last 24h from render-ping.log
✅ **Quick Actions** - Restart, briefing, logs, health checks

## Tech Stack

- Next.js 14 (React + TypeScript)
- Tailwind CSS
- Render API integration
- Real-time updates (5s polling)

## Local Setup

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Environment Variables

```
RENDER_API_KEY=your_render_api_key
```

## API Endpoints

- `GET /api/health` - System health check
- `GET /api/render-health` - Render apps status
- `POST /api/actions/[action]` - Quick actions

## Deployment

Created for Render deployment with:
- Auto-rebuild on GitHub push
- Environment variable configuration
- 24/7 monitoring capability

---

v0.1.0 - Mission Control MVP
