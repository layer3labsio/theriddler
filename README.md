# The Riddler Game

A brain-teasing riddle game built with React. Test your wit with challenging riddles and track your progress on the leaderboard!

## Features

- 🧠 10 challenging riddles to solve
- 🎯 Multiple choice answers (A, B, C, D)
- ✅ Instant feedback on your answers
- 🏆 Simple leaderboard tracking top scores
- 💾 Scores saved in localStorage
- 📱 Mobile-responsive design

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Run Locally

```bash
pnpm start
```

Server runs on `http://localhost:8000`. **Note:** HTTP endpoints are for local development only. The SDK requires HTTPS for all production connections.

### Deploy to Render.com

1. Push this repo to GitHub
2. Connect to Render.com
3. Create new Web Service from this repo
4. Render will auto-detect `render.yaml` and deploy

Your permanent URL: `https://the-riddler-[your-id].onrender.com/`

## How to Play

1. Read the riddle carefully
2. Choose one of the four multiple choice answers
3. Get instant feedback - green for correct, red for incorrect
4. Click "Next Riddle" to continue
5. Complete all riddles to see your final score
6. Check the leaderboard to see how you rank!

## Tech Stack

- **React** - UI components
- **TypeScript** - Type safety
- **Lucide React** - Icons
- **localStorage** - Persist leaderboard

## Privacy & Data Use

- **What we collect:** The game stores your scores locally in your browser's localStorage. No data is sent to external servers.
- **Retention:** Leaderboard entries are stored indefinitely in your localStorage until you clear your browser data.
- **Deletion:** Clear your browser's localStorage to delete all game data.

## License

MIT
