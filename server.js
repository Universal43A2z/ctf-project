const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const ctf = require("./ctf-challenges");

const app = express();
app.set("trust proxy", 1); // app runs behind Cloudflare tunnel (X-Forwarded-For)
const SALT_ROUNDS = 12;

// Admin access key (override with ADMIN_KEY env var in production)
const ADMIN_KEY = process.env.ADMIN_KEY || "ch4ncel0ck@dm1n";

// ── Persistent store ──────────────────────────────────────────────
// Accounts and teams are saved to data.json so they survive restarts
// and tunnel URL changes. Passwords are stored ONLY as bcrypt hashes.
const DATA_FILE = path.join(__dirname, "data.json");
const users = new Map();
let teams = [];

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!parsed || !Array.isArray(parsed.users)) return;
    parsed.users.forEach((u) => {
      if (u && (u.username || u.email) && typeof u.password === "string") {
        const username = u.username || u.email; // legacy accounts predate "username"
        users.set(username, {
          username,
          password: u.password, // already a bcrypt hash ($2b$...), never plaintext
          team: u.team || null,
          yearLevel: u.yearLevel || "—",
          createdAt: u.createdAt || Date.now(),
          lastLoginAt: u.lastLoginAt ?? null,
          solved: Array.isArray(u.solved) ? u.solved : [],
          score: Number(u.score) || 0,
        });
      }
    });
    teams = Array.isArray(parsed.teams) ? parsed.teams : [];
    console.log(`Loaded ${users.size} account(s) and ${teams.length} team(s)`);
  } catch (err) {
    console.error("Failed to load data.json:", err.message);
  }
}

function saveData() {
  try {
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(
      tmp,
      JSON.stringify({ version: 2, users: [...users.values()], teams }, null, 2)
    );
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.error("Failed to save data.json:", err.message);
  }
}

loadData();

// ── Account lockout tracking ──────────────────────────────────────
const failedAttempts = new Map();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function isLockedOut(email) {
  const record = failedAttempts.get(email);
  if (!record) return false;
  if (record.count >= LOCKOUT_THRESHOLD) {
    if (Date.now() - record.lastAttempt < LOCKOUT_DURATION_MS) {
      return true;
    }
    failedAttempts.delete(email);
  }
  return false;
}

function recordFailedAttempt(email) {
  const record = failedAttempts.get(email) || { count: 0, lastAttempt: 0 };
  record.count++;
  record.lastAttempt = Date.now();
  failedAttempts.set(email, record);
}

function clearFailedAttempts(email) {
  failedAttempts.delete(email);
}

// ── CSRF token helpers ────────────────────────────────────────────
function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

function csrfProtection(req, res, next) {
  if (req.method === "GET" || req.method === "HEAD") {
    const token = generateCsrfToken();
    if (req.session) req.session.csrfToken = token;
    res.locals.csrfToken = token;
    return next();
  }
  const token = (req.body && req.body._csrf) || req.headers["x-csrf-token"];
  if (!token || !req.session || token !== req.session.csrfToken) {
    return res.status(403).send("Forbidden: Invalid CSRF token");
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

// ── Middleware ─────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Helmet — security headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
  })
);

// Rate limiter — global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use(globalLimiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts, please try again later.",
});

// More lenient limiter for admin team/account management (bulk creation)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many admin requests, please try again later.",
});

// Session
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,       // set true in production with HTTPS
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 minutes
    },
  })
);

// Apply CSRF to all routes
app.use(csrfProtection);

// ── Auth middleware ────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

// ── Routes ────────────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/login"));

// ── Login ─────────────────────────────────────────────────────────
app.get("/login", (req, res) => {
  res.render("login", { error: null, csrfToken: res.locals.csrfToken });
});

app.post(
  "/login",
  authLimiter,
  [
    body("username").trim().notEmpty(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        error: "Invalid credentials",
        csrfToken: res.locals.csrfToken,
      });
    }

    const username = String(req.body.username || "").trim();
    const password = req.body.password;

    // Generic error message — never reveal if user exists
    if (isLockedOut(username)) {
      return res.status(429).render("login", {
        error: "Account temporarily locked. Try again later.",
        csrfToken: res.locals.csrfToken,
      });
    }

    const user = users.get(username);
    if (!user) {
      // Perform dummy hash to prevent user-enumeration timing attacks
      await bcrypt.hash("dummy", SALT_ROUNDS);
      recordFailedAttempt(username);
      return res.status(401).render("login", {
        error: "Invalid credentials",
        csrfToken: res.locals.csrfToken,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      recordFailedAttempt(username);
      return res.status(401).render("login", {
        error: "Invalid credentials",
        csrfToken: res.locals.csrfToken,
      });
    }

    // Success
    clearFailedAttempts(username);
    user.lastLoginAt = Date.now();
    saveData();
    req.session.regenerate((err) => {
      if (err) return res.status(500).send("Session error");
      req.session.userId = user.username;
      req.session.createdAt = Date.now();
      res.redirect("/dashboard");
    });
  }
);

// ── Dashboard (protected) ─────────────────────────────────────────
app.get("/dashboard", requireAuth, (req, res) => {
  const user = users.get(req.session.userId);
  if (!user) return res.redirect("/login");
  const totalChallenges = ctf.all.length;
  const recentSolves = user.solved
    .map((id) => ctf.getById(id))
    .filter(Boolean)
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  res.render("dashboard", {
    username: req.session.userId,
    team: user.team,
    yearLevel: user.yearLevel,
    memberSince: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    solvedCount: user.solved.length,
    totalChallenges,
    score: user.score,
    totalPoints: ctf.totalPoints(),
    completedPct: totalChallenges ? Math.round((user.solved.length / totalChallenges) * 100) : 0,
    recentSolves,
  });
});

// ── Logout ────────────────────────────────────────────────────────
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// ── CTF Game ──────────────────────────────────────────────────────
app.get("/ctf", requireAuth, (req, res) => {
  const user = users.get(req.session.userId);
  if (!user) return res.redirect("/login");

  const category = ctf.categories.includes(req.query.category)
    ? req.query.category
    : "All";

  const solvedSet = new Set(user.solved);
  const groups = ["easy", "medium", "hard"]
    .map((difficulty) => {
      const challenges = ctf[difficulty]
        .filter((ch) => category === "All" || ch.category === category)
        .map((ch) => ({
          id: ch.id,
          title: ch.title,
          points: ch.points,
          category: ch.category,
          solved: solvedSet.has(ch.id),
          hasFile: Boolean(ch.file),
        }));
      return { difficulty, challenges };
    })
    .filter((group) => group.challenges.length > 0);

  res.render("ctf", {
    groups,
    category,
    categories: ctf.categories,
    solvedCount: user.solved.length,
    totalChallenges: ctf.all.length,
    score: user.score,
    totalPoints: ctf.totalPoints(),
  });
});

app.get("/ctf/:id", requireAuth, (req, res) => {
  const user = users.get(req.session.userId);
  if (!user) return res.redirect("/login");

  const challenge = ctf.getById(req.params.id);
  if (!challenge) return res.status(404).send("Challenge not found");

  res.render("challenge", {
    challenge,
    solved: user.solved.includes(challenge.id),
    error: null,
    success: null,
  });
});

// Download the attached file for a challenge (authenticated players only)
app.get("/ctf/:id/download", requireAuth, (req, res) => {
  const user = users.get(req.session.userId);
  if (!user) return res.redirect("/login");

  const challenge = ctf.getById(req.params.id);
  if (!challenge) return res.status(404).send("Challenge not found");
  if (!challenge.file) return res.status(404).send("This challenge has no file");

  const filePath = path.join(__dirname, "challenge-files", `c${challenge.id}.${challenge.file.name.split(".").pop()}`);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  res.download(filePath, challenge.file.name);
});

app.post("/ctf/:id", requireAuth, [body("flag").trim()], async (req, res) => {
  const user = users.get(req.session.userId);
  if (!user) return res.redirect("/login");

  const challenge = ctf.getById(req.params.id);
  if (!challenge) return res.status(404).send("Challenge not found");

  const submitted = req.body.flag.trim().toLowerCase();
  const expected = challenge.flag.toLowerCase();
  const alreadySolved = user.solved.includes(challenge.id);

  // Timing-safe comparison to avoid leaking info about the flag length/content
  const submittedBuf = Buffer.from(submitted);
  const expectedBuf = Buffer.from(expected);
  const matched =
    submittedBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(submittedBuf, expectedBuf);

  if (matched && !alreadySolved) {
    user.solved.push(challenge.id);
    user.score += challenge.points;
    saveData();
    return res.render("challenge", {
      challenge,
      solved: true,
      error: null,
      success: "Correct flag! Challenge solved.",
    });
  }

  if (matched && alreadySolved) {
    return res.render("challenge", {
      challenge,
      solved: true,
      error: null,
      success: "Already solved — great work though!",
    });
  }

  res.render("challenge", {
    challenge,
    solved: false,
    error: "Incorrect flag. Try again.",
    success: null,
  });
});

// ── Admin (secret key gate) ───────────────────────────────────────
const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const USERNAME_RE = /^[A-Za-z0-9_.\- ]+$/;
const MAX_TEAM_MEMBERS = 20;

function adminPanelData() {
  const accounts = [...users.values()]
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((u) => ({
      username: u.username,
      team: u.team || "—",
      yearLevel: u.yearLevel || "—",
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      score: u.score,
      solvedCount: u.solved.length,
      solved: u.solved
        .map((id) => ctf.getById(id))
        .filter(Boolean)
        .map((c) => ({
          title: c.title,
          category: c.category,
          points: c.points,
          difficulty: c.difficulty,
        })),
    }));

  const leaderboard = [...users.values()]
    .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
    .map((u, i) => ({
      rank: i + 1,
      username: u.username,
      team: u.team || "—",
      score: u.score,
      solvedCount: u.solved.length,
      lastLoginAt: u.lastLoginAt,
    }));

  const teamMap = new Map();
  for (const u of users.values()) {
    if (!u.team) continue;
    let rec = teamMap.get(u.team);
    if (!rec) {
      rec = { team: u.team, players: 0, score: 0, solvedCount: 0, members: [] };
    }
    rec.players += 1;
    rec.score += u.score;
    rec.solvedCount += u.solved.length;
    rec.members.push({
      username: u.username,
      score: u.score,
      solved: u.solved
        .map((id) => ctf.getById(id))
        .filter(Boolean)
        .sort((a, b) => b.id - a.id)
        .map((c) => ({
          title: c.title,
          category: c.category,
          points: c.points,
          difficulty: c.difficulty,
        })),
    });
    teamMap.set(u.team, rec);
  }
  const teamLeaderboard = [...teamMap.values()]
    .sort((a, b) => b.score - a.score || b.solvedCount - a.solvedCount || b.players - a.players)
    .map((t, i) => ({ rank: i + 1, ...t }));

  return { accounts, leaderboard, teamLeaderboard };
}

app.get("/admin", (req, res) => {
  if (req.session && req.session.isAdmin) {
    const { accounts, leaderboard, teamLeaderboard } = adminPanelData();
    return res.render("admin", {
      authorized: true,
      accounts,
      leaderboard,
      teamLeaderboard,
      teams,
      totalChallenges: ctf.all.length,
      error: null,
      success: null,
      csrfToken: res.locals.csrfToken,
    });
  }
  res.render("admin", {
    authorized: false,
    accounts: [],
    leaderboard: [],
    teamLeaderboard: [],
    teams: [],
    totalChallenges: ctf.all.length,
    error: null,
    success: null,
    csrfToken: res.locals.csrfToken,
  });
});

app.post("/admin", authLimiter, async (req, res) => {
  const submitted = String(req.body.key || "");
  const expected = Buffer.from(ADMIN_KEY);
  const submittedBuf = Buffer.from(submitted);
  const matched =
    submittedBuf.length === expected.length &&
    crypto.timingSafeEqual(submittedBuf, expected);

  if (!matched) {
    return res.status(401).render("admin", {
      authorized: false,
      accounts: [],
      leaderboard: [],
      teamLeaderboard: [],
      teams: [],
      error: "Invalid admin key.",
      success: null,
      csrfToken: res.locals.csrfToken,
    });
  }

  req.session.isAdmin = true;
  res.redirect("/admin");
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.status(403).redirect("/admin");
}

// ── Create event team (admin creates member accounts) ─────────────
app.post("/admin/teams", adminLimiter, requireAdmin, async (req, res) => {
  const { accounts, leaderboard, teamLeaderboard } = adminPanelData();

  const render = (error, success) =>
    res.status(error ? 400 : 200).render("admin", {
      authorized: true,
      accounts,
      leaderboard,
      teamLeaderboard,
      teams,
      totalChallenges: ctf.all.length,
      error,
      success,
      csrfToken: res.locals.csrfToken,
    });

  const teamName = String(req.body.teamName || "").trim();
  const yearLevel = YEAR_LEVELS.includes(req.body.yearLevel)
    ? req.body.yearLevel
    : "—";
  const memberCount = Number.parseInt(req.body.memberCount, 10);
  const rawUsernames = []
    .concat(req.body.memberUsername || [])
    .map((v) => String(v || "").trim());
  const rawPasswords = []
    .concat(req.body.memberPassword || [])
    .map((v) => String(v || ""));

  const errors = [];

  if (!teamName) errors.push("Team name is required.");
  else if (teamName.length > 60) errors.push("Team name is too long (max 60 chars).");
  if (!Number.isInteger(memberCount) || memberCount < 1 || memberCount > MAX_TEAM_MEMBERS) {
    errors.push(`Member count must be between 1 and ${MAX_TEAM_MEMBERS}.`);
  }
  if (rawUsernames.length !== memberCount || rawPasswords.length !== memberCount) {
    errors.push("Member count does not match the submitted member fields.");
  }

  const usernames = rawUsernames;
  const seen = new Set();
  for (let i = 0; i < memberCount; i++) {
    const uname = usernames[i] || "";
    if (!uname) {
      errors.push(`Member ${i + 1}: username is required.`);
    } else if (!USERNAME_RE.test(uname) || uname.length < 2 || uname.length > 30) {
      errors.push(`Member ${i + 1}: username must be 2–30 chars of letters, numbers, spaces, '.', '_', '-'.`);
    } else if (seen.has(uname.toLowerCase())) {
      errors.push(`Member ${i + 1}: username "${uname}" is a duplicate in this form.`);
    } else if (users.has(uname)) {
      errors.push(`Username "${uname}" already exists.`);
    }
    const pw = rawPasswords[i] || "";
    if (!pw) errors.push(`Member ${i + 1}: password is required.`);
    else if (pw.length < 4) errors.push(`Member ${i + 1}: password must be at least 4 characters.`);
    else if (pw.length > 64) errors.push(`Member ${i + 1}: password is too long (max 64).`);
    seen.add(uname.toLowerCase());
  }

  if (errors.length > 0) return render(errors.join(" "), null);

  for (let i = 0; i < memberCount; i++) {
    const hash = await bcrypt.hash(rawPasswords[i], SALT_ROUNDS);
    users.set(usernames[i], {
      username: usernames[i],
      password: hash,
      team: teamName,
      yearLevel,
      createdAt: Date.now(),
      lastLoginAt: null,
      solved: [],
      score: 0,
    });
  }

  teams.push({
    id: crypto.randomUUID(),
    name: teamName,
    yearLevel,
    memberCount,
    members: usernames.map((u) => ({ username: u, createdAt: Date.now() })),
    createdAt: Date.now(),
  });
  saveData();

  return render(null, `Team "${teamName}" created with ${memberCount} member account(s).`);
});

app.post("/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  res.redirect("/admin");
});

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Secure server running at http://localhost:${PORT}`);
});
