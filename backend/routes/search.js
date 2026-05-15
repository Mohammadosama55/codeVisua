import { Router } from 'express';
import { searchWeb } from '../services/tavilyService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const results = await searchWeb(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
