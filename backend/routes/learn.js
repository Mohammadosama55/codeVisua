import { Router } from 'express';
import { generateLesson, generateHint, askQuestion } from '../services/groqService.js';
import { searchWeb } from '../services/tavilyService.js';
import { getCachedLesson, saveLessonCache, getCacheStats } from '../services/dbService.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { topic, forceRefresh } = req.body;
    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const t = topic.trim();

    // ── Check lesson cache ──────────────────────────────────────────────────
    if (!forceRefresh) {
      const cached = await getCachedLesson(t);
      if (cached) {
        console.log(`[lesson-cache] HIT for "${t}" (matched "${cached.cachedTopic}")`);
        // Web search still uses its own cache layer
        const webResults = await searchWeb(t);
        return res.json({
          lesson:      cached.data,
          webResults,
          fromCache:   true,
          cachedTopic: cached.cachedTopic,
        });
      }
    }

    // ── Cache miss → generate + search in parallel ──────────────────────────
    console.log(`[lesson-cache] MISS for "${t}" — calling Groq`);
    const [lesson, webResults] = await Promise.all([
      generateLesson(t),
      searchWeb(t),
    ]);

    // Save lesson to DB (fire-and-forget)
    saveLessonCache(t, lesson).catch(() => {});

    res.json({ lesson, webResults, fromCache: false });
  } catch (err) {
    console.error('Generate lesson error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate lesson' });
  }
});

router.post('/hint', async (req, res) => {
  try {
    const { topic, question } = req.body;
    const hint = await generateHint(topic, question);
    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get hint' });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { topic, question, history, context } = req.body;
    if (!topic || !question) return res.status(400).json({ error: 'topic and question required' });
    const answer = await askQuestion(topic, question, history || [], context || '');
    res.json({ answer });
  } catch (err) {
    console.error('Ask error:', err);
    res.status(500).json({ error: 'Failed to get answer' });
  }
});

// Stats endpoint (useful for monitoring cache health)
router.get('/cache-stats', async (_req, res) => {
  const stats = await getCacheStats();
  res.json(stats || { error: 'unavailable' });
});

export default router;
