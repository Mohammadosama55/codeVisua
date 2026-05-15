import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dsalearn_history';
const MAX_ITEMS = 20;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((topic, lesson) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.topic.toLowerCase() !== topic.toLowerCase());
      const entry = {
        id: Date.now(),
        topic,
        title: lesson?.title || topic,
        difficulty: lesson?.difficulty || 'Unknown',
        timeToLearn: lesson?.timeToLearn || '?',
        animType: lesson?.animation?.type || 'array',
        visitedAt: new Date().toISOString(),
      };
      return [entry, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const removeEntry = useCallback((id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, removeEntry, clearHistory };
}
