# Hear2Heal Backend Service

Express.js REST API Server integrated with Supabase Database for speech translation, emergency triage logs, and patient records.

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Start backend server:
   ```bash
   npm start
   # or for dev live reload:
   npm run dev
   ```

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Service health status |
| `GET` | `/api/health` | Supabase DB ping check |
| `POST` | `/api/translate` | Log patient/doctor translation |
| `POST` | `/api/triage` | Save emergency SOS triage event |
| `POST` | `/api/profile` | Save patient profile record |
| `GET` | `/api/history` | Retrieve latest translation logs |
