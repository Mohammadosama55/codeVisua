import axios from 'axios';
import { getCachedSearch, saveSearchCache } from './dbService.js';

export async function searchWeb(topic) {
  // ── 1. Check cache first ──────────────────────────────────────────────────
  const cached = await getCachedSearch(topic);
  if (cached) {
    console.log(`[search-cache] HIT for "${topic}" (matched "${cached.cachedTopic}")`);
    return { ...cached.data, fromCache: true, cachedTopic: cached.cachedTopic };
  }

  // ── 2. Cache miss → real Tavily call ─────────────────────────────────────
  console.log(`[search-cache] MISS for "${topic}" — calling Tavily`);
  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: process.env.TAVILY_API_KEY,
        query: `${topic} data structure algorithm real world use case example`,
        search_depth: 'basic',
        include_answer: true,
        include_images: false,
        max_results: 5,
      },
      { timeout: 10000 }
    );

    const results = {
      answer: response.data.answer || null,
      sources: (response.data.results || [])
        .map(r => ({
          title:   r.title,
          url:     r.url,
          snippet: r.content?.slice(0, 300) || '',
          score:   r.score,
        }))
        .slice(0, 4),
      fromCache: false,
    };

    // Save to DB (fire-and-forget — don't block the response)
    saveSearchCache(topic, results).catch(() => {});

    return results;
  } catch (err) {
    console.error('Tavily search error:', err.message);
    return { answer: null, sources: [], fromCache: false };
  }
}
