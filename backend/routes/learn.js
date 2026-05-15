import { Router } from 'express';
import { generateLesson, generateHint, askQuestion } from '../services/groqService.js';
import { searchWeb } from '../services/tavilyService.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const [lesson, webResults] = await Promise.all([
      generateLesson(topic.trim()),
      searchWeb(topic.trim()),
    ]);

    res.json({ lesson, webResults });
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

export default router;
