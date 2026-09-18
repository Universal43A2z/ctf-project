# Project Updates

Chronological log of notable changes to the Cyber CTF event game.

---

## 2026-09-19 — Event-game mode

The platform pivoted from an open registration site into an **admin-managed event game**.

### Removed public registration
- Deleted the `GET/POST /register` routes, the `register.ejs` view, and all
  sign-up links (nav "Sign Up", hero "REGISTER" button, "Create an account" link).
- `/register` now returns 404.
- Existing accounts continue to work — legacy accounts sign in with their
  former email value as the username.

### Username-based login
- Login identity switched from email to **username**.
- The login form field is now "ENTER USERNAME"; passwords unchanged.
- `data.json` schema bumped to `{"version": 2, "users": [...], "teams": [...]}`.

### Admin creates event teams & accounts
- New admin panel panel **"Create Event Team"**:
  - Team Name (required)
  - Year Level (optional, applies to all members)
  - **Number of Members** (1–20) — reveals that many member blocks, each with a
    **Username** and **Password** (min 4 chars)
- Submitting creates one login account per member (bcrypt-hashed) plus a team
  record.
- Validation: unique usernames (rejects duplicates and existing users), member
  count matches submitted fields, length/character rules.
- Members log in with the credentials the admin issued.

### Leaderboards (admin)
- **Team Leaderboard** — teams ranked by total aggregated points (sum of their
  members), with player count and total solves. Clicking a team name expands it
  to show each member's points and solved problems.
- **Top Players (Highest Points)** — the per-player leaderboard (formerly
  "Leaderboard"), now with team tags.

### Privacy
- The default admin key is no longer printed in the README. For any shared or
  public deployment the operator must set `ADMIN_KEY` (see `README.md`).
- `data.json` (which contains hashed account records) stays out of git via
  `.gitignore`.

### Deployment
- Local base image runs on port 3000 (`node server.js`, configured with a
  private `ADMIN_KEY`).
- Public access via a temporary Cloudflare quick tunnel
  (`npx -y cloudflared tunnel --url http://localhost:3000`); the URL rotates on
  each tunnel start, so browsers that used an older URL must be re-pointed.

### New files
- `public/admin.js` — dynamic team-member fields (CSP-safe, `script-src 'self'`).

### Changed files
- `server.js`, `views/login.ejs`, `views/admin.ejs`, `views/dashboard.ejs`,
  `public/style.css`, `README.md`, `FEATURES.md`, `docs/flow.md`.