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

// ── Persistent user store ─────────────────────────────────────────
// Accounts are saved to data.json so they survive restarts and tunnel
// URL changes. Passwords are stored ONLY as bcrypt hashes.
const DATA_FILE = path.join(__dirname, "data.json");
const users = new Map();

function loadUsers() {
  try {
    if (!fs.existsSync(DATA_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!parsed || !Array.isArray(parsed.users)) return;
    parsed.users.forEach((u) => {
      if (u && u.email && typeof u.password === "string") {
        users.set(u.email, {
          email: u.email,
          password: u.password, // already a bcrypt hash ($2b$...), never plaintext
          yearLevel: u.yearLevel || "—", // legacy accounts predate the field
          createdAt: u.createdAt || Date.now(),
          lastLoginAt: u.lastLoginAt ?? null,
          solved: Array.isArray(u.solved) ? u.solved : [],
          score: Number(u.score) || 0,
        });
      }
    });
    console.log(`Loaded ${users.size} persisted account(s)`);
  } catch (err) {
    console.error("Failed to load data.json:", err.message);
  }
}

function saveUsers() {
  try {
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(
      tmp,
      JSON.stringify({ version: 1, users: [...users.values()] }, null, 2)
    );
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.error("Failed to save data.json:", err.message);
  }
}

loadUsers();

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

// ── Register ──────────────────────────────────────────────────────
app.get("/register", (req, res) => {
  res.render("register", { errors: [], csrfToken: res.locals.csrfToken });
});

app.post(
  "/register",
  authLimiter,
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain a special character"),
    body("yearLevel")
      .isIn(["1st Year", "2nd Year", "3rd Year", "4th Year"])
      .withMessage("Select your year level"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        errors: errors.array(),
        csrfToken: res.locals.csrfToken,
      });
    }

    const { email, password, yearLevel } = req.body;
    if (users.has(email)) {
      return res.status(400).render("register", {
        errors: [{ msg: "Email already registered" }],
        csrfToken: res.locals.csrfToken,
      });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    users.set(email, {
      email,
      password: hash,
      yearLevel,
      createdAt: Date.now(),
      lastLoginAt: null,
      solved: [],
      score: 0,
    });
    saveUsers();

    res.redirect("/login");
  }
);

// ── Login ─────────────────────────────────────────────────────────
app.get("/login", (req, res) => {
  res.render("login", { error: null, csrfToken: res.locals.csrfToken });
});

app.post(
  "/login",
  authLimiter,
  [
    body("email").trim().isEmail().normalizeEmail(),
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

    const { email, password } = req.body;

    // Generic error message — never reveal if user exists
    if (isLockedOut(email)) {
      return res.status(429).render("login", {
        error: "Account temporarily locked. Try again later.",
        csrfToken: res.locals.csrfToken,
      });
    }

    const user = users.get(email);
    if (!user) {
      // Perform dummy hash to prevent user-enumeration timing attacks
      await bcrypt.hash("dummy", SALT_ROUNDS);
      recordFailedAttempt(email);
      return res.status(401).render("login", {
        error: "Invalid credentials",
        csrfToken: res.locals.csrfToken,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      recordFailedAttempt(email);
      return res.status(401).render("login", {
        error: "Invalid credentials",
        csrfToken: res.locals.csrfToken,
      });
    }

    // Success
    clearFailedAttempts(email);
    user.lastLoginAt = Date.now();
    saveUsers();
    req.session.regenerate((err) => {
      if (err) return res.status(500).send("Session error");
      req.session.userId = user.email;
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
    email: req.session.userId,
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
    saveUsers();
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
app.get("/admin", (req, res) => {
  if (req.session && req.session.isAdmin) {
    const accounts = [...users.values()]
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((u) => ({
        email: u.email,
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
        email: u.email,
        score: u.score,
        solvedCount: u.solved.length,
        lastLoginAt: u.lastLoginAt,
      }));

    return res.render("admin", {
      authorized: true,
      accounts,
      leaderboard,
      totalChallenges: ctf.all.length,
      error: null,
      csrfToken: res.locals.csrfToken,
    });
  }
  res.render("admin", {
    authorized: false,
    accounts: [],
    leaderboard: [],
    totalChallenges: ctf.all.length,
    error: null,
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
      error: "Invalid admin key.",
      csrfToken: res.locals.csrfToken,
    });
  }

  req.session.isAdmin = true;
  res.redirect("/admin");
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
