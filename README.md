# Student Management System

- `frontend/`: React + Vite, hosted on Vercel.
- `backend/`: Express + PostgreSQL, hosted as a Render Web Service.

## 1. Commit and push the folder changes

Commit the renamed folders, both package lockfiles, and the deployment configuration, then push to `main`. Both hosts must deploy the new commit. Existing local `.env` files were preserved during the rename and remain ignored by Git.

## 2. Configure Render

For the existing `bryanazrielproject` Web Service, open **Settings > Build & Deploy** and set:

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm run db:migrate && npm start` |
| Health Check Path | `/` |

Set these variables under **Environment**:

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `22` |
| `NODE_ENV` | `production` |
| `BACKEND_URL` | `https://bryanazrielproject.onrender.com` |
| `FRONTEND_URL` | Your exact production Vercel origin, e.g. `https://your-project.vercel.app`, with no trailing slash |
| `DATABASE_URL` | Your production PostgreSQL connection string, including any SSL parameters required by your provider |
| `JWT_SECRET` | A long random secret |
| `CSRF_SECRET` | A different long random secret |
| `ADMIN_EMAIL` | Email for the initial admin |
| `ADMIN_PASSWORD` | Strong password for the initial admin |

Render supplies `PORT`; do not override it. The start command applies the committed Drizzle migrations before launching the API. Startup creates the initial admin only when the users table is empty. Existing users and passwords are preserved.

The root `render.yaml` supplies the same settings for a Blueprint deployment and generates the two secrets. If you manage the existing service manually, enter the settings above; merely committing `render.yaml` does not update a manually managed service. Use one management method for this service.

Deploy the latest commit. Visit `https://bryanazrielproject.onrender.com/` and confirm the API response. This endpoint checks that the HTTP server is running; check Render logs for successful database connection as well.

## 3. Configure Vercel

Import the same GitHub repository, or update the existing project's settings:

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Install Command | `npm ci --include=dev` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| `VITE_API_BASE_URL` environment variable | `/api` |

`frontend/vercel.json` includes the build settings, proxies `/api/*` to `https://bryanazrielproject.onrender.com/api/*`, and serves `index.html` for application routes. No frontend start command is needed.

Keep `VITE_API_BASE_URL=/api` in Vercel (or remove that variable to use the default). An old `localhost` or direct Render URL overrides the proxy. Keeping browser API requests on the frontend origin allows the existing login and CSRF cookies to work through the proxy. Never put database credentials or backend secrets in `VITE_*` variables because they are public browser configuration.

Deploy, copy the production Vercel origin into Render's `FRONTEND_URL`, and redeploy Render if that value changed. If the Render hostname changes, update the API rewrite in `frontend/vercel.json` and redeploy Vercel.

Verify login, page refresh on `/students`, a student save, logout, and login again on the deployed site. A free Render service may take time to wake after inactivity. Use the configured production Vercel origin for verification; a preview deployment has a different origin.

## Local development

If starting from a fresh clone, copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`. Fill in the backend values. Existing local environment files do not need replacing.

In one terminal:

```powershell
cd backend
npm ci --include=dev
npm run db:migrate
npm run dev
```

In another terminal:

```powershell
cd frontend
npm ci --include=dev
npm run dev
```

Vite proxies `/api` to `http://localhost:7000`. If you change the backend port, update `frontend/vite.config.js`, or explicitly set `VITE_API_BASE_URL` in your local frontend `.env`.

Deployment references: [Render Blueprints](https://render.com/docs/blueprint-spec), [Render root directories](https://render.com/docs/monorepo-support), and [Vercel rewrites](https://vercel.com/docs/rewrites).
