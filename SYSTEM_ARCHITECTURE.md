# i4C Website System Architecture

This document maps each business feature to the actual implementation in this codebase.

## 1) High-Level Architecture

- **Frontend**: React + Vite + Tailwind (`frontend/`)
- **Backend**: Node.js + Express (`backend/`)
- **Database**: MongoDB via Mongoose
- **Media Storage**: Cloudinary (primary)
- **Email**: Nodemailer SMTP
- **Analytics**: GA4 + custom analytics endpoint

Request flow:

1. User interacts with UI (`frontend/src`)
2. Frontend calls `/api/*` (Vite proxy -> `http://localhost:5000`)
3. Express routes validate input (Zod), then read/write MongoDB models
4. Optional side effects:
   - inquiry email via SMTP
   - media upload to Cloudinary
   - analytics event logging

## 2) Monorepo Structure

```txt
i4c-main/
  backend/                 # Express API + Mongoose + auth + uploads
  frontend/                # React/Vite UI
  package.json             # workspace scripts (dev/dev:all/build)
```

### Backend key folders

- `backend/src/models`: Mongoose schemas
- `backend/src/routes`: API endpoints
- `backend/src/middleware`: auth guard
- `backend/src/utils`: env, db, jwt, cloudinary, mailer, errors
- `backend/src/server.js`: app bootstrap and route mounting

### Frontend key folders

- `frontend/src/components`: public site sections
- `frontend/src/pages/admin`: admin login/dashboard/protection
- `frontend/src/lib/api.ts`: typed API helper + auth token handling
- `frontend/src/App.tsx`: app routes + analytics tracker

## 3) Feature-to-Code Mapping

## 3.1 Inquiry System ("Get a Quote")

### Goal

- Collect leads from homepage
- Validate input
- Store in MongoDB
- Notify via email
- Let admin review submissions

### Mongoose model

- File: `backend/src/models/Inquiry.js`
- Fields:
  - `name`, `email`, `phone`, `service`, `message`
  - `source`, `status`
  - timestamps

### API endpoints

- **POST** `/api/inquiries` (public)
  - Route file: `backend/src/routes/inquiries.routes.js`
  - Validates payload with Zod
  - Creates `Inquiry` record
  - Calls `sendInquiryNotificationEmail()`
- **GET** `/api/inquiries` (admin protected)
  - Returns latest inquiries for dashboard

### Frontend integration

- Contact form component: `frontend/src/components/Contact.tsx`
- API client call: `apiFetch("/api/inquiries", { method: "POST" ... })`
- Error surfacing: `frontend/src/lib/api.ts`

### Email notification

- Utility: `backend/src/utils/mailer.js`
- Env-based SMTP transport
- Sends inquiry summary to `MAIL_TO`

---

## 3.2 Admin Dashboard (CMS)

### Goal

- Secure admin access
- Manage content (Projects, Services, Testimonials)
- Review inquiries

### Authentication

- Model: `backend/src/models/AdminUser.js`
- Login API: `POST /api/auth/login` in `backend/src/routes/auth.routes.js`
- JWT sign/verify:
  - `backend/src/utils/jwt.js`
  - `backend/src/middleware/requireAdmin.js`

### Protected admin frontend

- Login page: `frontend/src/pages/admin/AdminLogin.tsx`
- Protected route wrapper: `frontend/src/pages/admin/RequireAdmin.tsx`
- Dashboard UI: `frontend/src/pages/admin/AdminDashboard.tsx`
- Token storage helper: `frontend/src/lib/api.ts` (`i4c_admin_token`)

### CMS CRUD APIs

- **Projects**
  - GET `/api/projects` (public)
  - POST/PUT/DELETE `/api/projects/:id` (admin)
  - Route: `backend/src/routes/projects.routes.js`
  - Model: `backend/src/models/Project.js`
- **Services**
  - GET `/api/services` (public)
  - POST/PUT/DELETE `/api/services/:id` (admin)
  - Route: `backend/src/routes/services.routes.js`
  - Model: `backend/src/models/Service.js`
- **Testimonials**
  - GET `/api/testimonials` (public, published)
  - POST/PUT/DELETE `/api/testimonials/:id` (admin)
  - Route: `backend/src/routes/testimonials.routes.js`
  - Model: `backend/src/models/Testimonial.js`

### Dashboard capabilities implemented

- Inquiries list view
- Projects: Add/Edit/Delete
- Services: Add/Edit/Delete
- Testimonials: Add/Edit/Delete
- Media upload utility panel

---

## 3.3 Media Management System

### Goal

- Upload project images from admin
- Store securely in cloud

### Backend implementation

- Upload route: `POST /api/upload/image`
  - File: `backend/src/routes/upload.routes.js`
  - Middleware: `multer` memory storage + size limit
  - Auth: `requireAdmin`
- Cloudinary client: `backend/src/utils/cloudinary.js`

### Frontend implementation

- Admin upload UI in `frontend/src/pages/admin/AdminDashboard.tsx`
- Uses `FormData` + `/api/upload/image`
- Displays uploaded URL and publicId

---

## 3.4 Cost Estimator

### Goal

- Let users estimate rough cost by service + area

### Backend endpoint

- POST `/api/estimator/estimate`
- File: `backend/src/routes/estimator.routes.js`
- Logic:
  - service -> price per sqm map
  - subtotal = area * unit price
  - contingency = 10%
  - estimate = subtotal + contingency

### Frontend UI

- Component: `frontend/src/components/CostEstimator.tsx`
- Added to homepage in `frontend/src/pages/Index.tsx`
- Shows breakdown + disclaimer

---

## 3.5 Analytics Integration

### Tracked events

- Page visits: `page_view`
- User behavior: `scroll_depth` milestones
- Conversions:
  - `quote_submitted`
  - `cost_estimate`

### Frontend implementation

- App-level tracker in `frontend/src/App.tsx`
- Conversion events in:
  - `frontend/src/components/Contact.tsx`
  - `frontend/src/components/CostEstimator.tsx`
- Optional GA4 injection from env in `frontend/src/main.tsx`

### Backend endpoint

- POST `/api/analytics/event`
- File: `backend/src/routes/analytics.routes.js`
- Current behavior: accepts and logs events (extendable to DB/queue later)

## 4) Database Design Summary

- `AdminUser`
  - email, passwordHash, role, name, lastLoginAt
- `Inquiry`
  - name, email, phone, service, message, source, status
- `Project`
  - title, category, location, year, client, description, status, coverImageUrl, images[]
- `Service`
  - title, description, features[], icon, order
- `Testimonial`
  - name, position, company, rating, content, project, imageUrl, order, isPublished

All models are timestamped (`createdAt`, `updatedAt`) and indexed where useful.

## 5) Environment Variables

## 5.1 Backend (`backend/.env`)

- `PORT`, `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `WEB_ORIGIN`
- `ADMIN_BOOTSTRAP_*`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## 5.2 Frontend (`frontend` env)

- `VITE_GA_MEASUREMENT_ID` (optional)

## 6) Local Development

From project root:

```bash
npm install
npm run dev:all
```

Runs:

- Web: `http://localhost:8080`
- API: `http://localhost:5000`

## 7) Production Hardening Checklist (next steps)

- Replace permissive CORS with exact production origins
- Rotate admin bootstrap credentials and disable bootstrap in prod
- Move analytics events to persistent storage
- Add rate-limit policies per sensitive route (auth/inquiries)
- Add request-id logging and centralized error tracing
- Add integration tests for inquiry/auth/CRUD flows

