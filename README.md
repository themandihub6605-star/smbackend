# Influencer Live Platform — Backend

## Folder Structure (MVC)

```
backend/
├── server.js                  # entry point - starts DB then server
├── .env.example                # copy to .env and fill real values
├── src/
│   ├── app.js                  # express app, middlewares, routes wiring
│   ├── config/
│   │   ├── env.config.js       # all env vars read from here (single source)
│   │   ├── db.config.js        # MongoDB connection
│   │   └── cors.config.js      # CORS allowed origins
│   ├── models/                 # Mongoose schemas (M in MVC)
│   │   ├── influencer.model.js
│   │   ├── superAdmin.model.js
│   │   └── liveSession.model.js
│   ├── controllers/             # business logic (C in MVC)
│   │   ├── auth.controller.js
│   │   ├── superAdmin.controller.js
│   │   ├── influencer.controller.js
│   │   └── liveSession.controller.js
│   ├── routes/                  # route -> controller mapping (acts as View layer for API)
│   │   ├── auth.routes.js
│   │   ├── superAdmin.routes.js
│   │   ├── influencer.routes.js
│   │   ├── liveSession.routes.js
│   │   └── index.js             # combines all routes
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── role.middleware.js   # role-based access (influencer/superadmin)
│   │   └── error.middleware.js  # global error + 404 handler
│   ├── services/
│   │   └── zoom.service.js      # Zoom API calls (create/end meeting)
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── apiError.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   └── zoomSignature.js     # signature for embedding Zoom (no branding)
│   └── seed/
│       └── createSuperAdmin.js  # run once to create first super admin login
```

## Setup

```bash
cd backend
cp .env.example .env      # then fill in real values
npm install
node src/seed/createSuperAdmin.js   # one-time: creates your super admin login
npm run dev                          # starts server with nodemon
```

## API Overview

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/influencer/register | Public | Influencer signup (status: pending) |
| POST | /api/auth/influencer/login | Public | Influencer login (must be accepted) |
| POST | /api/auth/superadmin/login | Public | Super admin login |
| GET | /api/superadmin/influencers | Super Admin | List all influencer registrations |
| PATCH | /api/superadmin/influencers/:id/accept | Super Admin | Approve influencer |
| PATCH | /api/superadmin/influencers/:id/reject | Super Admin | Reject influencer |
| GET | /api/influencer/live-list | Public | List of influencers currently live |
| GET | /api/influencer/me | Influencer | My own profile |
| POST | /api/live/go-live | Influencer | Start a Zoom meeting + go live |
| PATCH | /api/live/end-live | Influencer | End current live session |
| GET | /api/live/join/:influencerId | Public | Get join credentials for embedded Zoom |

## Notes
- Zoom is never shown as "zoom.us" — frontend uses Zoom Meeting SDK with the
  signature returned from `/api/live/go-live` and `/api/live/join/:id` to render
  the video fully inside your own website UI.
- Every influencer's live session is a separate Zoom meeting, so many can be
  live at the same time without conflict.
