import { useState, useCallback } from 'react';
import { generateLesson } from '../services/api';

export function useLesson() {
  const [lesson, setLesson] = useState(null);
  const [webResults, setWebResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(null);

  const fetchLesson = useCallback(async (topic, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setLesson(null);
    setWebResults(null);
    setCacheInfo(null);
    try {
      const data = await generateLesson(topic, forceRefresh);
      setLesson(data.lesson);
      setWebResults(data.webResults);
      setCacheInfo({
        lessonFromCache:    data.fromCache    ?? false,
        webFromCache:       data.webResults?.fromCache ?? false,
        cachedTopic:        data.cachedTopic  ?? null,
        webCachedTopic:     data.webResults?.cachedTopic ?? null,
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate lesson');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lesson, webResults, loading, error, cacheInfo, fetchLesson };
}
