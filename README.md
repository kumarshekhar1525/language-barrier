# Hear2Heal - Medical Translation & Triage System

Structured Full-Stack Architecture (`frontend/` & `backend/`) with Supabase Database Cloud Integration.

## 📁 Repository Structure

```
├── frontend/               # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/                # UI Screens, Components & Supabase Client
│   ├── index.html          # Main HTML entry point
│   ├── vite.config.ts      # Vite configuration
│   ├── package.json        # Frontend dependencies
│   └── .env                # Frontend environment variables
│
├── backend/                # Node.js + Express + Supabase API Server
│   ├── server.js           # REST API endpoints (/api/translate, /api/triage, /api/profile)
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables
│
└── README.md
```

## 🚀 Quick Run Guide

### 1. Run Frontend
```bash
cd frontend
npm run dev
# or from root workspace:
npm run dev:frontend
```

### 2. Run Backend Server
```bash
cd backend
npm run dev
# or from root workspace:
npm run dev:backend
```

### 3. Build Production Bundle
```bash
npm run build:frontend
```

## ⚡ Supabase Setup
- Direct Link to Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- SQL Editor: [https://supabase.com/dashboard/project/_/sql](https://supabase.com/dashboard/project/_/sql)
