import axios from 'axios';

export async function searchWeb(topic) {
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

    const results = response.data;
    return {
      answer: results.answer || null,
      sources: (results.results || []).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content?.slice(0, 300) || '',
        score: r.score,
      })).slice(0, 4),
    };
  } catch (err) {
    console.error('Tavily search error:', err.message);
    return { answer: null, sources: [] };
  }
}
