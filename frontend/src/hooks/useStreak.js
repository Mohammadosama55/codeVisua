import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth.jsx';

const KEY = 'dsalearn_streak';

const XP_TABLE = {
  first:   150,
  repeat:   25,
  quiz:     50,
  perfect: 100,
};

const LEVELS = [
  { level: 1,  min: 0,    title: 'Novice',       color: 'text-gray-400'   },
  { level: 2,  min: 200,  title: 'Apprentice',   color: 'text-green-400'  },
  { level: 3,  min: 500,  title: 'Learner',      color: 'text-blue-400'   },
  { level: 4,  min: 900,  title: 'Explorer',     color: 'text-cyan-400'   },
  { level: 5,  min: 1400, title: 'Practitioner', color: 'text-violet-400' },
  { level: 6,  min: 2000, title: 'Developer',    color: 'text-purple-400' },
  { level: 7,  min: 2700, title: 'Engineer',     color: 'text-yellow-400' },
  { level: 8,  min: 3600, title: 'Architect',    color: 'text-orange-400' },
  { level: 9,  min: 4800, title: 'Expert',       color: 'text-red-400'    },
  { level: 10, min: 6500, title: 'DSA Master',   color: 'text-pink-400'   },
];

function todayKey() { return new Date().toISOString().split('T')[0]; }

const EMPTY = { xp: 0, streak: 0, lastStudyDate: null, studiedToday: false, seenTopics: [], totalLessons: 0 };

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') || EMPTY; }
  catch { return EMPTY; }
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

export function getLevelInfo(xp) {
  let current = LEVELS[0], next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) { current = LEVELS[i]; next = LEVELS[i + 1] || null; break; }
  }
  const progress = next
    ? Math.round(((xp - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { current, next, progress, xp };
}

export function useStreak() {
  const { user } = useAuth();
  const [data,  setData]  = useState(loadLocal);
  const [toast, setToast] = useState(null);
  const [synced, setSynced] = useState(false);
  const prevUserRef = useRef(null);

  /* ── Load from DB when user signs in ── */
  useEffect(() => {
    if (user && !synced) {
      apiFetch('/streak')
        .then(remote => {
          const merged = {
            ...remote,
            seenTopics: Array.isArray(remote.seenTopics) ? remote.seenTopics : [],
          };
          setData(merged);
          localStorage.setItem(KEY, JSON.stringify(merged));
          setSynced(true);
        })
        .catch(() => setSynced(true));
    }
    if (!user) {
      setSynced(false);
      if (prevUserRef.current) setData(loadLocal());
    }
    prevUserRef.current = user;
  }, [user, synced]);

  /* ── Persist locally whenever data changes ── */
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  /* ── Debounced DB sync ── */
  const syncTimer = useRef(null);
  const syncToDB = useCallback((latest) => {
    if (!user) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      apiFetch('/streak', { method: 'PUT', body: JSON.stringify(latest) }).catch(() => {});
    }, 800);
  }, [user]);

  const showToast = useCallback((msg, sub, icon = '🎉') => {
    setToast({ msg, sub, icon, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const recordLesson = useCallback((topic) => {
    const today = todayKey();
    setData(prev => {
      const isNew  = !prev.seenTopics.includes(topic.toLowerCase());
      const xpGain = isNew ? XP_TABLE.first : XP_TABLE.repeat;

      const wasYesterday = (() => {
        if (!prev.lastStudyDate) return false;
        const d = new Date(prev.lastStudyDate);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0] === today;
      })();

      const newStreak    = prev.lastStudyDate === today ? prev.streak
                         : wasYesterday ? prev.streak + 1 : 1;
      const streakBroken = prev.lastStudyDate && !wasYesterday
                        && prev.lastStudyDate !== today && prev.streak > 0;

      const next = {
        ...prev,
        xp:            prev.xp + xpGain,
        streak:        newStreak,
        lastStudyDate: today,
        studiedToday:  true,
        seenTopics:    isNew ? [...prev.seenTopics, topic.toLowerCase()] : prev.seenTopics,
        totalLessons:  prev.totalLessons + 1,
      };

      const prevLevel = getLevelInfo(prev.xp).current.level;
      const newLevel  = getLevelInfo(next.xp).current.level;

      setTimeout(() => {
        if (newLevel > prevLevel)
          showToast(`Level ${newLevel} unlocked!`, getLevelInfo(next.xp).current.title, '🏆');
        else if (streakBroken)
          showToast('Streak reset — start fresh!', 'New streak: 1 day', '🔄');
        else if (newStreak > 1 && newStreak % 5 === 0)
          showToast(`${newStreak}-day streak!`, `+${xpGain} XP earned`, '🔥');
        else
          showToast(`+${xpGain} XP`, isNew ? 'New topic unlocked!' : 'Keep it up!', isNew ? '⭐' : '✨');
      }, 800);

      syncToDB(next);
      return next;
    });
  }, [showToast, syncToDB]);

  const recordQuizScore = useCallback((score, total) => {
    const isPerfect = score === total;
    const xpGain = isPerfect ? XP_TABLE.perfect : Math.round((score / total) * XP_TABLE.quiz);
    if (xpGain === 0) return;
    setData(prev => {
      const next = { ...prev, xp: prev.xp + xpGain };
      syncToDB(next);
      return next;
    });
    showToast(`Quiz: ${score}/${total}`, `+${xpGain} XP`, isPerfect ? '🏆' : '📝');
  }, [showToast, syncToDB]);

  return { data, toast, recordLesson, recordQuizScore, getLevelInfo };
}
