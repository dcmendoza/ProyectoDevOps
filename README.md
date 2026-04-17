# Mini Trello - Proyecto Universitario CI/CD

Aplicación full stack para gestión de tareas en equipo (estilo mini Trello), construida como monorepo con pipeline completo de CI/CD, despliegue por ambientes (staging/production), smoke tests y rollback manual.

## 📘 Documentación de entrega final (EAFIT)

- Guía completa de sustentación, arquitectura, pipelines, evidencias y checklist: **`docs/ENTREGA_FINAL_EAFIT.md`**

## 1) Descripción
Este proyecto permite que usuarios registrados creen tableros colaborativos, administren listas y tareas, asignen responsables y muevan tareas por estado (`TODO`, `DOING`, `DONE`). Está pensado para demostrar buenas prácticas de DevOps en contexto universitario.

## 2) Arquitectura
- **Frontend (React + Vite)**: UI, autenticación y consumo de API.
- **Backend (Node.js + Express)**: API REST modular con JWT.
- **DB (PostgreSQL + Prisma)**: persistencia relacional y ORM.
- **CI/CD (GitHub Actions)**: lint + tests + coverage + build + deploy.
- **Deploy (Render)**: `render.yaml` con servicios para staging y producción.

## 3) Stack tecnológico
- Frontend: React + Vite (JavaScript)
- Backend: Node.js + Express
- DB: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Lint: ESLint
- Tests: Vitest + Testing Library + Supertest
- Infra local: Docker Compose
- CI/CD: GitHub Actions
- IaC Deploy: Render (`render.yaml`)

## 4) Estructura de carpetas
```bash
mini-trello/
  backend/
    prisma/
    src/
      modules/{auth,users,boards,lists,tasks}
      middleware/
      utils/
      app.js
      server.js
    tests/
  frontend/
    src/
      pages/
      components/
      services/
      hooks/
      context/
      utils/
  .github/workflows/
  docker-compose.yml
  render.yaml
  README.md
```

## 5) Variables de entorno
### backend/.env
- `PORT=4000`
- `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mini_trello`
- `JWT_SECRET=...`
- `CORS_ORIGIN=http://localhost:5173`

### frontend/.env
- `VITE_API_URL=http://localhost:4000/api`

> Ver ejemplos en `backend/.env.example` y `frontend/.env.example`.

## 6) Cómo correr localmente
```bash
# 1) Clonar y entrar
cd mini-trello

# 2) Levantar todo
docker compose up --build

# 3) (Opcional) seed demo desde backend
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
```

Accesos:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

Usuario demo seed:
- `ana@demo.com` / `password123`

## 7) Cómo correr tests
```bash
cd backend && npm test
cd frontend && npm test
```

## 8) Cómo correr lint
```bash
cd backend && npm run lint
cd frontend && npm run lint
```

## 9) Migraciones y seed
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

## 10) Cómo funciona CI
Workflow: `.github/workflows/ci.yml`

Se ejecuta en `push` y `pull_request` a `develop` y `main`.
Incluye:
1. Install dependencias.
2. Lint backend/frontend.
3. Test + coverage backend/frontend.
4. Build backend/frontend.
5. Upload artefactos de coverage.

## 11) Cómo funciona CD
### Staging (`deploy-staging.yml`)
- Trigger: push a `develop`.
- Ejecuta validaciones básicas.
- Lanza deploy en Render (staging).
- Ejecuta smoke test a `/api/health`.

### Production (`deploy-production.yml`)
- Trigger: push a `main` o manual.
- Valida build.
- Lanza deploy en Render (producción).
- Ejecuta smoke test post deploy.

### Rollback (`rollback.yml`)
- Trigger manual (`workflow_dispatch`).
- Requiere `service_id` + `deploy_id`.
- Ejecuta rollback vía API de Render.

## 12) Estrategia de ramas
- `feature/*`: desarrollo de funcionalidades.
- `develop`: integración y staging.
- `main`: versión estable y producción.

## 13) Ambientes
- **Staging**: rama `develop`, smoke tests de preproducción.
- **Production**: rama `main`, entorno público estable.

## 14) Evidencia recomendada para presentación
1. Pipeline CI exitoso con lint/test/coverage/build.
2. Deploy automático a staging al mergear a develop.
3. Deploy automático/manual a producción.
4. Smoke tests verdes post deploy.
5. Ejecución de rollback manual en workflow.
6. Demo funcional: login, tableros, listas, tareas, mover tareas.

## 15) Tres mejoras implementadas (obligatorias)
1. **Quality gate en CI**: lint + tests + coverage threshold.
2. **Separación de ambientes**: workflows y servicios diferenciados para staging/production.
3. **Resiliencia operativa**: smoke tests y rollback manual preparado.

## Secrets/Config vars para GitHub Actions
Configurar en Settings > Secrets and variables > Actions:
- `RENDER_API_KEY`
- `RENDER_STAGING_SERVICE_ID`
- `RENDER_PROD_SERVICE_ID`
- `STAGING_API_URL`
- `PRODUCTION_API_URL`

## Endpoints principales
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Boards: `GET/POST /api/boards`, `GET/PATCH/DELETE /api/boards/:boardId`
- Members: `POST/GET /api/boards/:boardId/members`
- Lists: `GET/POST /api/boards/:boardId/lists`, `PATCH/DELETE /api/lists/:listId`
- Tasks: `POST /api/lists/:listId/tasks`, `GET/PATCH/DELETE /api/tasks/:taskId`, `PATCH /api/tasks/:taskId/move`
- Health: `GET /api/health`

## Pendientes dependientes de credenciales externas
- Deploy real en Render (requiere IDs reales y API key).
- URLs finales de staging/producción en secrets.
