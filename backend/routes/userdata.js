import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const pool   = new pg.Pool({ connectionString: process.env.DATABASE_URL });

function requireAuth(req, res, next) {
  if (!req.session?.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

/* ════════════════════════════════
   HISTORY
════════════════════════════════ */

/* GET /api/userdata/history — return all entries newest-first */
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, topic, title, difficulty, time_to_learn AS "timeToLearn",
              anim_type AS "animType", visited_at AS "visitedAt"
       FROM   user_history
       WHERE  user_id = $1
       ORDER  BY visited_at DESC
       LIMIT  50`,
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('history GET error:', err);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

/* POST /api/userdata/history — upsert one entry */
router.post('/history', requireAuth, async (req, res) => {
  try {
    const { topic, title, difficulty, timeToLearn, animType } = req.body;
    if (!topic) return res.status(400).json({ error: 'topic required' });
    const { rows } = await pool.query(
      `INSERT INTO user_history (user_id, topic, title, difficulty, time_to_learn, anim_type, visited_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (user_id, topic)
       DO UPDATE SET title = $3, difficulty = $4, time_to_learn = $5,
                     anim_type = $6, visited_at = NOW()
       RETURNING id, topic, title, difficulty,
                 time_to_learn AS "timeToLearn", anim_type AS "animType", visited_at AS "visitedAt"`,
      [req.session.userId, topic.trim(), title || topic, difficulty || null,
       timeToLearn || null, animType || null]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('history POST error:', err);
    res.status(500).json({ error: 'Failed to save history entry' });
  }
});

/* DELETE /api/userdata/history/:id */
router.delete('/history/:id', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM user_history WHERE id = $1 AND user_id = $2',
      [req.params.id, req.session.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

/* DELETE /api/userdata/history — clear all */
router.delete('/history', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM user_history WHERE user_id = $1', [req.session.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

/* ════════════════════════════════
   STREAKS / XP
════════════════════════════════ */

/* GET /api/userdata/streak */
router.get('/streak', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT xp, streak, last_study_date AS "lastStudyDate",
              studied_today AS "studiedToday", seen_topics AS "seenTopics",
              total_lessons AS "totalLessons"
       FROM   user_streaks WHERE user_id = $1`,
      [req.session.userId]
    );
    if (!rows[0]) return res.json({ xp: 0, streak: 0, lastStudyDate: null, studiedToday: false, seenTopics: [], totalLessons: 0 });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load streak' });
  }
});

/* PUT /api/userdata/streak — full replace */
router.put('/streak', requireAuth, async (req, res) => {
  try {
    const { xp, streak, lastStudyDate, studiedToday, seenTopics, totalLessons } = req.body;
    await pool.query(
      `INSERT INTO user_streaks
         (user_id, xp, streak, last_study_date, studied_today, seen_topics, total_lessons, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET xp=$2, streak=$3, last_study_date=$4, studied_today=$5,
             seen_topics=$6, total_lessons=$7, updated_at=NOW()`,
      [req.session.userId, xp ?? 0, streak ?? 0, lastStudyDate ?? null,
       studiedToday ?? false, JSON.stringify(seenTopics ?? []), totalLessons ?? 0]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('streak PUT error:', err);
    res.status(500).json({ error: 'Failed to save streak' });
  }
});

export default router;
