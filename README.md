# Script to Novel Converter

**Live:** https://script-to-book.onrender.com  
**Stack:** Node + React + Docker

## Quick Start

```bash
docker-compose up  # or use Render blueprints
```

## Structure

- **server/**: Node/Express API with WebSockets
- **frontend/**: React SPA (Vite)
- **render.yaml**: Cloud deploy config

## Deploy

Push to GitHub → Render auto-deploys both services.
