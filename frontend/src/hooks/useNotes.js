import { useState, useCallback } from 'react';

const KEY = 'dsalearn_notes';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useNotes(topic) {
  const [all, setAll] = useState(load);

  const topicKey = (topic || '').toLowerCase().trim();

  const getNote = useCallback((stepId) => {
    return all[topicKey]?.[stepId] || '';
  }, [all, topicKey]);

  const setNote = useCallback((stepId, text) => {
    setAll(prev => {
      const next = {
        ...prev,
        [topicKey]: { ...(prev[topicKey] || {}), [stepId]: text },
      };
      if (!text.trim()) delete next[topicKey][stepId];
      save(next);
      return next;
    });
  }, [topicKey]);

  const noteCount = Object.keys(all[topicKey] || {}).filter(k => all[topicKey][k]).length;

  return { getNote, setNote, noteCount };
}
