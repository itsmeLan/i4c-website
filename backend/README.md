## i4c-main backend (Express + MongoDB)

### Setup

1) Copy env file:

- Create `backend/.env` based on `backend/.env.example`

2) Install deps:

- `npm i` (in `backend/`)

3) Start MongoDB locally (or use Atlas), then run:

- `npm run dev` (in `backend/`)

### API

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/inquiries` (public)
- `GET /api/inquiries` (admin)
- `GET/POST/PUT/DELETE /api/projects` (GET is public, others admin)
- `GET/POST/PUT/DELETE /api/services` (GET is public, others admin)
- `GET/POST/PUT/DELETE /api/testimonials` (GET is public, others admin)
- `POST /api/upload/image` (admin, multipart form-data `file`)
- `POST /api/estimator/estimate` (public)
- `POST /api/analytics/event` (public)

