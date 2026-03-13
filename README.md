# Sistema IASD (Monorepo)

Este repositorio contiene el **backend** (NestJS + MongoDB) y el **frontend** (React + Vite + Tailwind).

## Estructura
- `backend/` API (NestJS)
- `frontend/` UI (React)

## Requisitos
- Node.js 18+ (recomendado 20+)
- MongoDB en ejecución

## Configuración rápida
### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Variables de entorno
### Backend (`backend/.env`)
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

### Frontend (`frontend/.env`)
- `VITE_API_URL` (ej: `http://localhost:3000/api`)

## GitHub
- No subir `.env` ni secretos.
