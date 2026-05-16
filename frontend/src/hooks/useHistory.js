import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth.jsx';

const STORAGE_KEY = 'dsalearn_history';
const MAX_ITEMS   = 20;

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`/api/userdata${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory]   = useState(loadLocal);
  const [synced,  setSynced]    = useState(false);
  const prevUserRef = useRef(null);

  /* ── Load from DB when user signs in ── */
  useEffect(() => {
    if (user && !synced) {
      apiFetch('/history')
        .then(rows => {
          const entries = rows.map(r => ({ ...r, id: r.id }));
          setHistory(entries);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
          setSynced(true);
        })
        .catch(() => setSynced(true));
    }
    if (!user) {
      setSynced(false);
      if (prevUserRef.current) {
        setHistory(loadLocal());
      }
    }
    prevUserRef.current = user;
  }, [user, synced]);

  /* ── Persist locally whenever history changes ── */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((topic, lesson) => {
    const entry = {
      id: Date.now(),
      topic,
      title:       lesson?.title || topic,
      difficulty:  lesson?.difficulty || 'Unknown',
      timeToLearn: lesson?.timeToLearn || '?',
      animType:    lesson?.animation?.type || 'array',
      visitedAt:   new Date().toISOString(),
    };

    setHistory(prev => {
      const filtered = prev.filter(h => h.topic.toLowerCase() !== topic.toLowerCase());
      return [entry, ...filtered].slice(0, MAX_ITEMS);
    });

    /* Sync to DB (fire-and-forget) */
    if (user) {
      apiFetch('/history', {
        method: 'POST',
        body: JSON.stringify({
          topic:       entry.topic,
          title:       entry.title,
          difficulty:  entry.difficulty,
          timeToLearn: entry.timeToLearn,
          animType:    entry.animType,
        }),
      }).then(saved => {
        setHistory(prev => prev.map(h =>
          h.topic.toLowerCase() === topic.toLowerCase() ? { ...h, id: saved.id } : h
        ));
      }).catch(() => {});
    }
  }, [user]);

  const removeEntry = useCallback((id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    if (user) apiFetch(`/history/${id}`, { method: 'DELETE' }).catch(() => {});
  }, [user]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (user) apiFetch('/history', { method: 'DELETE' }).catch(() => {});
  }, [user]);

  return { history, addEntry, removeEntry, clearHistory };
}
