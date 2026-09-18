# Program Flow

Server: `server.js` (Express + EJS + helmet). Persistent state: `data.json` (users) and `ctf-challenges.js` (challenge catalog, read-only).

## Request lifecycle

Every request passes a middleware chain (`server.js:121-168`), then hits a route:

```
request
  ├─ helmet()  → security headers (CSP, HSTS, no sniffing, …)
  ├─ rate limiter (global + auth/admin limiters)
  ├─ express-session (secret, httpOnly, sameSite)
  ├─ flash (one-shot success/error messages)
  ├─ CSRF protection (token in every form, verified on POST/DELETE)
  └─ router (routes below)
```

## Routes

```
GET  /                  → redirect → /login
GET  /login             → renders login.ejs (hero landing + login card)
POST /login             → validate credentials → set session → /dashboard
GET  /register          → renders register.ejs
POST /register          → validate inputs (incl. year level) →
                          hash password (bcrypt) → save user → /login
GET  /dashboard         → requireAuth → dashboard.ejs (stats, mission, recent solves)
POST /logout            → requireAuth + CSRF → destroy session → /login
GET  /ctf               → requireAuth → ctf.ejs (challenge grid grouped by difficulty)
GET  /ctf/:id           → requireAuth → challenge.ejs (description, ciphertext, hint, file)
POST /ctf/:id           → requireAuth + CSRF → submit flag (see below)
GET  /ctf/:id/download  → requireAuth → res.download(challenge-files/cN.ext)
GET  /admin             → admin login page (ADMIN_KEY, env override)
POST /admin             → authLimiter + CSRF → validate admin key → admin session
POST /admin/logout      → CSRF → clear admin session → /admin
(app.use catch-all)     → 404
```

## Flag submission flow (`POST /ctf/:id`)

```
submit flag (form field "flag")
  → trim + lowercase
  → constant-time compare against challenge.flag   (no length/timing leak)
  → match?
     ├─ YES → already solved?
     │         ├─ yes → rerender, no points
     │         └─ no  → push id to user.solved, user.score += points,
     │                  persist data.json → render with success message
     └─ NO  → render with error message
```

## Data → view

- `data.json` → users (email, bcrypt hash, year level, solved[], score, admin flag…)
- `ctf-challenges.js` → `easy/medium/hard/all`, `getById(id)`, points totals
- **Flags never reach the browser.** `challenge.ejs` renders title, description, ciphertext, hint, and file — never `challenge.flag`. No route returns challenge objects as JSON.
- Dashboard reads solves/points by mapping `user.solved` through `ctf.getById()`.

## Security notes

- CSRF token required on all state-changing forms (login/page and admin).
- Timing-safe flag comparison.
- Rate limiting on auth + admin endpoints.
- Session cookie is httpOnly; CSP blocks inline scripts (`script-src 'self'`), so event handlers must use `addEventListener` (see `theme.js`).