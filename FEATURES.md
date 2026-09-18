# Feature Inventory

All features of the Cyber CTF platform, grouped by area.

## Authentication & Accounts

| # | Feature | Details |
|---|---------|---------|
| 1 | Registration | Email + 8-char password (upper, lower, digit, special) + year level (1st–4th), rate-limited |
| 2 | Login | Email/password with generic errors (no user enumeration) |
| 3 | Sessions | express-session, random key per boot, 30-min expiry, HttpOnly + SameSite=Strict cookie |
| 4 | Session rotation | `session.regenerate()` on login to prevent session fixation |
| 5 | Logout | Destroys session + clears cookie (CSRF-protected) |
| 6 | Account persistence | Accounts/scores stored in `data.json`, survive restarts & tunnel URL changes |
| 7 | Password hashing | bcrypt, 12 salt rounds |

## Security Features

| # | Feature | Details |
|---|---------|---------|
| 8 | CSRF protection | Per-session token, checked on every POST (all forms, incl. logout/admin) |
| 9 | Account lockout | 5 failed logins → locked 15 minutes |
| 10 | Auth rate limiting | 10 requests / 15 min (login, admin key) |
| 11 | Global rate limiting | 100 requests / 15 min per IP |
| 12 | Security headers | Helmet: CSP, HSTS, X-Frame-Options, etc. |
| 13 | Timing-safe flag compare | `crypto.timingSafeEqual` for flags & admin key |
| 14 | Login timing equalizer | Dummy bcrypt hash for unknown emails (anti-enumeration) |
| 15 | Trust proxy | Correct client IP detection behind Cloudflare |

## CTF Gameplay

| # | Feature | Details |
|---|---------|---------|
| 16 | Challenge board | Cards grouped by difficulty (easy/medium/hard) showing points + solved status |
| 17 | Category filter | Filter by 6 categories via URL query |
| 18 | Challenge detail page | Description, data, hint (collapsible), flag submit form |
| 19 | Flag submission | Timing-safe compare, awards points once; no re-award on resubmit |
| 20 | Per-user progress | Solved list, score, and solved/total counters |
| 21 | Leaderboard stats | Score, solved count, and max-points display |
| 22 | File challenges | Downloadable attachments (`/ctf/:id/download`) for 5 file-based challenges |
| 23 | 58 challenges | 14,700 pts: 15 easy / 32 medium / 11 hard across 6 categories |

## Admin Panel

| # | Feature | Details |
|---|---------|---------|
| 24 | Secret key gate | `/admin` unlock via timing-safe key, own session persistence, rate-limited |
| 25 | Leaderboard | Ranked players (gold/silver/bronze), points, solved count, last login |
| 26 | Accounts table | Username, team, year level, registered/last-login dates, score, solved problems (expandable) |
| 27 | Exit admin | Session-scoped admin flag, CSRF-protected |

## Content (challenge categories covered)

| # | Feature | Details |
|---|---------|---------|
| 28 | Encoding/Decoding | base64, base32, hex, octal, binary, URL, reverse, ROT13/47, Caesar, Morse |
| 29 | Cryptography | XOR, Vigenère, Atbash, Affine, Rail Fence, Progressive, Polybius, Bacon, RSA, Hill, Playfair |
| 30 | Steganography | LSB image stego, whitespace encoding, acrostic poem |
| 31 | Linux/terminal | grep, sed, awk, cut, sort/uniq, xxd, strings, sha256 challenges |
| 32 | OSINT | ARPANET, RFC, WWW historical research |
| 33 | Forensics | Magic bytes, EXIF metadata, binary/file analysis |
| 34 | Web analysis | robots.txt, HTTP headers, API exposure |

## Platform / Ops

| # | Feature | Details |
|---|---------|---------|
| 35 | Port/host | Port 3000 (env-overridable), binds `0.0.0.0` |
| 36 | Deployment | Ready for Cloudflare quick tunnel (documented in README) |
| 37 | 404 handling | Custom `404 Not Found` for unknown routes |
| 38 | Light/Dark theme toggle | Site-wide toggle (button on every page), persisted in `localStorage`, defaults to dark; login page shows the poster design in light mode |

---

Total: 38 features.