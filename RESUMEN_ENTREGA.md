# Resumen de Entrega — Mini Trello (CI/CD)

## 1) Árbol de archivos creado (resumen)
```txt
mini-trello/
  backend/
    prisma/
    src/
      modules/{auth,users,boards,lists,tasks}
      middleware/
      utils/
    tests/
  frontend/
    src/
      pages/
      components/
      services/
      context/
  .github/workflows/
  docker-compose.yml
  render.yaml
  README.md
```

## 2) Arquitectura (resumen)
- Frontend React consume API REST del backend.
- Backend Express modular con validación, auth JWT y control de permisos por membresía de tablero.
- Persistencia PostgreSQL con Prisma.
- CI/CD con GitHub Actions + deploy Render staging/producción.

## 3) Endpoints (resumen)
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
- Boards + Members: `/api/boards`, `/api/boards/:boardId`, `/api/boards/:boardId/members`.
- Lists: `/api/boards/:boardId/lists`, `/api/lists/:listId`.
- Tasks: `/api/lists/:listId/tasks`, `/api/tasks/:taskId`, `/api/tasks/:taskId/move`.
- Health: `/api/health`.

## 4) Pantallas frontend
- Login.
- Registro.
- Dashboard de tableros.
- Vista de tablero tipo kanban con listas y tareas.
- Alta de tablero/lista.
- Modal de crear/editar tarea y controles para mover tarea.

## 5) Cómo correr localmente
```bash
docker compose up --build
```

Opcional: migrar + seed desde backend.

## 6) Secretos que debes configurar
- `RENDER_API_KEY`
- `RENDER_STAGING_SERVICE_ID`
- `RENDER_PROD_SERVICE_ID`
- `STAGING_API_URL`
- `PRODUCTION_API_URL`

## 7) Cómo desplegar staging y producción
- Staging: push a `develop` → workflow de deploy + smoke test.
- Production: push a `main` o manual → deploy + smoke test.
- Rollback: workflow manual con `service_id` y `deploy_id`.

## 8) Qué quedó listo vs pendiente externo
**Listo:** código full stack, estructura monorepo, tests/lint/build, Docker Compose, workflows CI/CD, Render IaC, README completo.

**Pendiente externo (credenciales):** conectar secrets reales de GitHub/Render y URLs finales para ejecutar deploy real y rollback sobre servicios existentes.

## Testing
- ✅ `npm run lint`
- ✅ `npm run test`
- ✅ `npm run build`

> Nota: no pude adjuntar screenshot porque en este entorno no está disponible la herramienta de captura de navegador solicitada (`browser_container`).
