import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
    pool.on('error', (err) => console.error('PG pool error:', err.message));
  }
  return pool;
}

/** Normalise a topic string for use as a cache key */
export function normaliseKey(topic) {
  return topic.toLowerCase().trim().replace(/\s+/g, ' ');
}

/* ─── Web-search cache ─── */

/** Return cached web results if topic similarity ≥ threshold (0–1). */
export async function getCachedSearch(topic) {
  const key = normaliseKey(topic);
  try {
    const res = await getPool().query(
      `SELECT results_json, topic_raw,
              GREATEST(similarity(topic_key, $1),
                       word_similarity(topic_key, $1),
                       word_similarity($1, topic_key)) AS sim
       FROM   web_search_cache
       WHERE  GREATEST(similarity(topic_key, $1),
                       word_similarity(topic_key, $1),
                       word_similarity($1, topic_key)) >= 0.55
       ORDER  BY sim DESC
       LIMIT  1`,
      [key]
    );
    if (res.rows.length > 0) {
      // Bump hit counter (fire-and-forget)
      getPool().query(
        'UPDATE web_search_cache SET hit_count = hit_count + 1 WHERE topic_key = $1',
        [normaliseKey(res.rows[0].topic_raw)]
      ).catch(() => {});
      return { data: res.rows[0].results_json, cachedTopic: res.rows[0].topic_raw };
    }
    return null;
  } catch (err) {
    console.error('getCachedSearch error:', err.message);
    return null;
  }
}

export async function saveSearchCache(topic, results) {
  const key = normaliseKey(topic);
  try {
    await getPool().query(
      `INSERT INTO web_search_cache (topic_key, topic_raw, results_json)
       VALUES ($1, $2, $3)
       ON CONFLICT (topic_key) DO UPDATE
         SET results_json = EXCLUDED.results_json,
             hit_count    = web_search_cache.hit_count + 1`,
      [key, topic, JSON.stringify(results)]
    );
  } catch (err) {
    console.error('saveSearchCache error:', err.message);
  }
}

/* ─── Lesson cache ─── */

export async function getCachedLesson(topic) {
  const key = normaliseKey(topic);
  try {
    const res = await getPool().query(
      `SELECT lesson_json, topic_raw,
              GREATEST(similarity(topic_key, $1),
                       word_similarity(topic_key, $1),
                       word_similarity($1, topic_key)) AS sim
       FROM   lesson_cache
       WHERE  GREATEST(similarity(topic_key, $1),
                       word_similarity(topic_key, $1),
                       word_similarity($1, topic_key)) >= 0.60
       ORDER  BY sim DESC
       LIMIT  1`,
      [key]
    );
    if (res.rows.length > 0) {
      getPool().query(
        'UPDATE lesson_cache SET hit_count = hit_count + 1, updated_at = NOW() WHERE topic_key = $1',
        [normaliseKey(res.rows[0].topic_raw)]
      ).catch(() => {});
      return { data: res.rows[0].lesson_json, cachedTopic: res.rows[0].topic_raw };
    }
    return null;
  } catch (err) {
    console.error('getCachedLesson error:', err.message);
    return null;
  }
}

export async function saveLessonCache(topic, lesson) {
  const key = normaliseKey(topic);
  try {
    await getPool().query(
      `INSERT INTO lesson_cache (topic_key, topic_raw, lesson_json)
       VALUES ($1, $2, $3)
       ON CONFLICT (topic_key) DO UPDATE
         SET lesson_json = EXCLUDED.lesson_json,
             hit_count   = lesson_cache.hit_count + 1,
             updated_at  = NOW()`,
      [key, topic, JSON.stringify(lesson)]
    );
  } catch (err) {
    console.error('saveLessonCache error:', err.message);
  }
}

/* ─── Stats (for admin/debug) ─── */
export async function getCacheStats() {
  try {
    const res = await getPool().query(`
      SELECT
        (SELECT COUNT(*) FROM lesson_cache)     AS lessons_cached,
        (SELECT COUNT(*) FROM web_search_cache) AS searches_cached,
        (SELECT COALESCE(SUM(hit_count),0) FROM lesson_cache)     AS lesson_hits,
        (SELECT COALESCE(SUM(hit_count),0) FROM web_search_cache) AS search_hits
    `);
    return res.rows[0];
  } catch (err) {
    return null;
  }
}
