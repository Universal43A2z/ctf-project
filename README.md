# Cyber CTF Project

Full-stack Capture The Flag platform built with Node.js + Express + EJS.
Features secure login/register, 58 challenges across 6 categories, downloadable files, and an admin panel.

---

## Quick Start

```bash
# install dependencies (first time only)
npm install

# start the server (default port 3000)
node server.js

# open in browser
http://localhost:3000
```

To expose publicly via Cloudflare tunnel:
```bash
npx -y cloudflared tunnel --url http://localhost:3000
# copy the https://XXXX.trycloudflare.com URL from the output
```

---

## Tech Stack

| Layer          | Technology                         |
|----------------|------------------------------------|
| Runtime        | Node.js                            |
| Web framework  | Express                            |
| Templating     | EJS                                |
| Security       | Helmet, express-rate-limit, bcrypt |
| Hashing        | bcrypt (12 salt rounds)            |
| Sessions       | express-session (random per-boot)  |
| CSRF protection| per-session token, CSRF middleware  |
| Deployment     | Cloudflare quick tunnel (free)     |

---

## Project Structure

```
ctf-project/
├── server.js              ← main app: routes, middleware, auth, admin
├── ctf-challenges.js      ← 58 challenge definitions + categories
├── challenge-files/       ← downloadable files for file-based challenges
│   ├── c54.zip
│   ├── c55.png
│   ├── c56.csv
│   ├── c57.bin
│   └── c58.log
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── ctf.ejs            ← challenge board with category filters
│   ├── challenge.ejs      ← individual challenge detail + submit form
│   └── admin.ejs          ← leaderboard + accounts table
├── public/
│   └── style.css          ← dark-theme UI
├── package.json
└── package-lock.json
```

**Note:** `node_modules/` is NOT inside this folder — it resolves from the parent directory (`/home/khent/node_modules`). If moving the project elsewhere, run `npm install` inside the project folder first.

---

## Server & Port

- **Default port:** `3000` (hardcoded)
- **Host:** binds to all interfaces (`0.0.0.0`)
- **Trust proxy:** enabled (`app.set("trust proxy", 1)`) — required behind Cloudflare tunnel for correct IP detection

---

## Admin Access

| Item             | Value                                                    |
|------------------|----------------------------------------------------------|
| URL              | `/admin`                                                 |
| Access type      | Secret key gate (no username required)                   |
| Default key      | `ch4ncel0ck@dm1n`                                        |
| Override (env)   | `ADMIN_KEY=yourkey node server.js`                       |
| Auth limiter     | max 10 attempts per 15 minutes                           |
| CSRF protected   | Yes (form token checked)                                 |
| Session required | No (public, but has its own session to persist unlock)   |

---

## Login Security Features

| Feature                       | Details                                                   |
|-------------------------------|-----------------------------------------------------------|
| Password hashing              | bcrypt, 12 salt rounds                                    |
| Account lockout               | 5 failed logins → locked 15 minutes                       |
| Rate limiting (auth)          | max 10 requests / 15 min (login, register, admin)         |
| Rate limiting (global)        | max 100 requests / 15 min                                 |
| CSRF tokens                   | per-session, checked on every POST                        |
| Login errors                  | generic "Invalid email or password" (no user enumeration) |
| Flag submissions              | timing-safe comparison (no timing leaks)                  |
| Session                       | random secret per boot; in-memory only (no persistence)   |

---

## Challenges — 58 total / 14,700 points

### By Difficulty

| Difficulty | Count | Points each | Subtotal |
|------------|-------|-------------|----------|
| Easy       | 15    | 100         | 1,500    |
| Medium     | 32    | 250         | 8,000    |
| Hard       | 11    | 500         | 5,500    |
| **Total**  | **58**|             | **14,700**|

### By Category

| Category            | Count |
|---------------------|-------|
| General Skills      | 38    |
| Forensics           | 10    |
| OSINT               | 3     |
| Web Exploitation    | 3     |
| Wireshark Analysis  | 2     |
| Other Topics        | 2     |

### Challenge Types

| Type                            | IDs           |
|---------------------------------|---------------|
| Encoding/Decoding (base64, hex, Caesar, ROT, XOR, Morse, etc.) | 1–10, 16–25, 27, 29–30, 35–36 |
| Cryptography (RSA, Rail Fence, Playfair, Affine) | 11, 13–14, 26 |
| Steganography (LSB, acrostic)   | 28, 49        |
| Linux/terminal commands (grep, sed, awk, cut, sort/uniq, xxd, strings, sha256) | 37–38, 39–42, 44 |
| OSINT (research)                 | 45–47         |
| Forensics (magic bytes, metadata)| 48, 50        |
| Web analysis (robots.txt, headers, API) | 51–53        |
| File-based (download + extract) | 54–58         |

### File Challenges

Downloadable files are served at `GET /ctf/:id/download` (login required):

| ID | Filename        | Tool                         | Flag                    |
|----|-----------------|------------------------------|-------------------------|
| 54 | `suspicious.zip`| `unzip; cat flag.txt`        | `flag{beware_zip_bombs}`|
| 55 | `selfie.png`    | `strings selfie.png`         | `flag{png_comment}`     |
| 56 | `manifest.csv`  | `cut -d',' -f3 | grep flag` | `flag{manifest_csv}`    |
| 57 | `payload.bin`   | `strings payload.bin`        | `flag{binary_whispers}` |
| 58 | `system.log`    | `grep flag system.log`       | `flag{log_grep_hunt}`   |

---

## Categories

Defined in `ctf-challenges.js` (used for board filtering + admin display):

```js
const CATEGORIES = [
  "General Skills",
  "Forensics",
  "Wireshark Analysis",
  "Other Topics",
  "OSINT",
  "Web Exploitation",
];
```

---

## Routes

| Method | Path                   | Auth     | Description                        |
|--------|------------------------|----------|------------------------------------|
| GET    | `/`                    | —        | redirects to `/login`              |
| GET    | `/register`            | no       | registration form                  |
| POST   | `/register`            | no       | create account                     |
| GET    | `/login`               | no       | login form                         |
| POST   | `/login`               | no       | authenticate                       |
| GET    | `/dashboard`           | yes      | user dashboard (score + progress)  |
| POST   | `/dashboard`           | yes      | logout                             |
| GET    | `/ctf`                 | yes      | challenge board + category filters  |
| GET    | `/ctf/:id`             | yes      | challenge detail + submit form      |
| POST   | `/ctf/:id`             | yes      | submit flag                        |
| GET    | `/ctf/:id/download`    | yes      | download challenge file            |
| GET    | `/admin`               | no*      | admin key gate page                |
| POST   | `/admin`               | no*      | submit admin key                   |
| GET    | `/admin` (authorized)  | session  | leaderboard + accounts table       |
| POST   | `/admin/logout`        | session  | lock admin panel                   |

---

## Persistent Storage

| What           | Storage                  | Details                                      |
|----------------|--------------------------|----------------------------------------------|
| Accounts       | `data.json` (JSON file)  | Email, bcrypt hash, scores, solved list       |
| Passwords      | bcrypt (`$2b$...` hashes)| Never stored in plaintext                     |
| Sessions       | express-session in-memory| Lost on restart (users stay; just re-login)   |
| Rate limits    | in-memory per-IP counters| Reset on restart                              |

Accounts and scores persist across restarts and tunnel URL changes.
Sessions are ephemeral — a new URL means the browser has no session cookie,
so the user simply logs in again and finds all their accounts/scores intact.

---

## Running Behind Cloudflare Tunnel

```bash
# start server
node server.js &

# start tunnel
npx cloudflared tunnel --url http://localhost:3000 &

# find the URL
grep -oE "https://[a-z0-9.-]+\.trycloudflare\.com" /tmp/ctf-tunnel.log | tail -1
```

**Known DNS quirk:** Fresh tunnel URLs may temporarily fail to resolve from your router's local DNS. Workaround: switch device DNS to `1.1.1.1` or `8.8.8.8`, or wait ~60 seconds.

---

## Key Files Reference

| File                 | Purpose                                  |
|----------------------|------------------------------------------|
| `server.js`          | All routes, middleware, session config    |
| `ctf-challenges.js`  | All 58 challenge definitions + categories|
| `views/admin.ejs`    | Admin panel: leaderboard + accounts       |
| `challenge-files/`   | Downloadable files (c54–c58)             |
| `public/style.css`   | Dark-theme styling                       |

---

## Admin Key (quick reference)

```
ch4ncel0ck@dm1n
```
