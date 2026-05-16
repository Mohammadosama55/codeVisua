import express from 'express';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

/* ── helpers ── */
async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]
  );
  return rows[0] ?? null;
}
async function findByUsername(username) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1', [username]
  );
  return rows[0] ?? null;
}
function safeUser(u) {
  const { password_hash, ...rest } = u;
  return rest;
}

/* ── POST /api/auth/register ── */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'username, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    if (await findByEmail(email))
      return res.status(409).json({ error: 'Email already in use' });
    if (await findByUsername(username))
      return res.status(409).json({ error: 'Username already taken' });

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash, display_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [username.trim(), email.trim().toLowerCase(), hash, (displayName || username).trim()]
    );
    const user = rows[0];
    req.session.userId = user.id;
    res.status(201).json(safeUser(user));
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/* ── POST /api/auth/login ── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid email or password' });

    req.session.userId = user.id;
    res.json(safeUser(user));
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/* ── POST /api/auth/logout ── */
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('dsalearn.sid');
    res.json({ ok: true });
  });
});

/* ── GET /api/auth/me ── */
router.get('/me', async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });
    res.json(safeUser(rows[0]));
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
