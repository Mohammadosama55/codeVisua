import { useState, useCallback } from 'react';
import { generateLesson } from '../services/api';

export function useLesson() {
  const [lesson, setLesson] = useState(null);
  const [webResults, setWebResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLesson = useCallback(async (topic) => {
    setLoading(true);
    setError(null);
    setLesson(null);
    setWebResults(null);
    try {
      const data = await generateLesson(topic);
      setLesson(data.lesson);
      setWebResults(data.webResults);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate lesson');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lesson, webResults, loading, error, fetchLesson };
}
