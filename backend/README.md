# Iglesia Adventista - Backend

API en NestJS + MongoDB para registrar grupos pequeños, estudios bíblicos y visitas.

## Requisitos
- Node.js 18+ (recomendado 20+)
- MongoDB en ejecución

## Configuración
1. Copia el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
2. Ajusta:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

## Desarrollo
```bash
npm install
npm run start:dev
```

## Endpoints principales
- `POST /api/auth/login`
- `GET /api/groups` (usuario/admin)
- `POST /api/groups` (admin)
- `GET /api/studies` (usuario/admin)
- `POST /api/studies` (admin)
- `GET /api/visits` (usuario/admin)
- `POST /api/visits` (admin)
- `GET /api/reports/summary` (admin)

## Roles
- **admin**: CRUD completo + reportes.
- **user**: solo lectura.

## GitHub
- No subas `.env` ni secretos.
