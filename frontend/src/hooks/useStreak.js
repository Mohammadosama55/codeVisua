import { useState, useEffect, useCallback } from 'react';

const KEY = 'dsalearn_streak';

const XP_TABLE = {
  first:  150,
  repeat:  25,
  quiz:    50,
  perfect: 100,
};

const LEVELS = [
  { level: 1,  min: 0,    title: 'Novice',        color: 'text-gray-400'  },
  { level: 2,  min: 200,  title: 'Apprentice',     color: 'text-green-400' },
  { level: 3,  min: 500,  title: 'Learner',        color: 'text-blue-400'  },
  { level: 4,  min: 900,  title: 'Explorer',       color: 'text-cyan-400'  },
  { level: 5,  min: 1400, title: 'Practitioner',   color: 'text-violet-400'},
  { level: 6,  min: 2000, title: 'Developer',      color: 'text-purple-400'},
  { level: 7,  min: 2700, title: 'Engineer',       color: 'text-yellow-400'},
  { level: 8,  min: 3600, title: 'Architect',      color: 'text-orange-400'},
  { level: 9,  min: 4800, title: 'Expert',         color: 'text-red-400'   },
  { level: 10, min: 6500, title: 'DSA Master',     color: 'text-pink-400'  },
];

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') || {
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      studiedToday: false,
      seenTopics: [],
      totalLessons: 0,
    };
  } catch {
    return { xp: 0, streak: 0, lastStudyDate: null, studiedToday: false, seenTopics: [], totalLessons: 0 };
  }
}

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next    = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) { current = LEVELS[i]; next = LEVELS[i + 1] || null; break; }
  }
  const progress = next
    ? Math.round(((xp - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { current, next, progress, xp };
}

export function useStreak() {
  const [data, setData] = useState(load);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const showToast = useCallback((msg, sub, icon = '🎉') => {
    setToast({ msg, sub, icon, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const recordLesson = useCallback((topic) => {
    const today = todayKey();
    setData(prev => {
      const isNew      = !prev.seenTopics.includes(topic.toLowerCase());
      const xpGain     = isNew ? XP_TABLE.first : XP_TABLE.repeat;
      const wasYesterday = (() => {
        if (!prev.lastStudyDate) return false;
        const d = new Date(prev.lastStudyDate);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0] === today;
      })();
      const newStreak = prev.lastStudyDate === today
        ? prev.streak
        : wasYesterday ? prev.streak + 1 : 1;
      const streakBroken = prev.lastStudyDate && !wasYesterday && prev.lastStudyDate !== today && prev.streak > 0;

      const next = {
        ...prev,
        xp: prev.xp + xpGain,
        streak: newStreak,
        lastStudyDate: today,
        studiedToday: true,
        seenTopics: isNew ? [...prev.seenTopics, topic.toLowerCase()] : prev.seenTopics,
        totalLessons: prev.totalLessons + 1,
      };

      const prevLevel = getLevelInfo(prev.xp).current.level;
      const newLevel  = getLevelInfo(next.xp).current.level;

      setTimeout(() => {
        if (newLevel > prevLevel) {
          showToast(`Level ${newLevel} unlocked!`, getLevelInfo(next.xp).current.title, '🏆');
        } else if (streakBroken) {
          showToast('Streak reset — start fresh!', `New streak: 1 day`, '🔄');
        } else if (newStreak > 1 && newStreak % 5 === 0) {
          showToast(`${newStreak}-day streak!`, `+${xpGain} XP earned`, '🔥');
        } else {
          showToast(`+${xpGain} XP`, isNew ? 'New topic unlocked!' : 'Keep it up!', isNew ? '⭐' : '✨');
        }
      }, 800);

      return next;
    });
  }, [showToast]);

  const recordQuizScore = useCallback((score, total) => {
    const isPerfect = score === total;
    const xpGain = isPerfect ? XP_TABLE.perfect : Math.round((score / total) * XP_TABLE.quiz);
    if (xpGain === 0) return;
    setData(prev => ({ ...prev, xp: prev.xp + xpGain }));
    showToast(`Quiz: ${score}/${total}`, `+${xpGain} XP`, isPerfect ? '🏆' : '📝');
  }, [showToast]);

  return { data, toast, recordLesson, recordQuizScore, getLevelInfo };
}
