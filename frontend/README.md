# Iglesia Adventista - Frontend

Frontend en React + Vite + Tailwind para el sistema de grupos pequeños, estudios bíblicos y visitas.

## Requisitos
- Node.js 18+ (recomendado 20+)
- Backend en ejecución

## Configuración
1. Copia el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
2. Ajusta `VITE_API_URL` según tu backend.

## Desarrollo
```bash
npm install
npm run dev
```

## Build de producción
```bash
npm run build
npm run preview
```

## Estructura
- `src/pages`: vistas principales
- `src/components`: componentes reutilizables
- `src/lib`: cliente API y utilidades de sesión

## GitHub
- No subas `.env` ni secretos.
- Recomendado: crear repositorio separado del backend.
