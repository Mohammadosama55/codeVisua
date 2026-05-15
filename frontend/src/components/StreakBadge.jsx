import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Trophy, ChevronUp, X, Zap, BookOpen, Target } from 'lucide-react';
import { getLevelInfo } from '../hooks/useStreak';

const MILESTONES = [
  { streak: 3,  icon: '🔥', label: '3-day streak'   },
  { streak: 7,  icon: '⚡', label: 'One week!'       },
  { streak: 14, icon: '💎', label: 'Two weeks!'      },
  { streak: 30, icon: '🏆', label: 'One month!'      },
  { streak: 100,icon: '👑', label: 'Legend!'         },
];

function StatBox({ icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-gray-800/60 rounded-xl p-3 border border-gray-700">
      <span className="text-xl">{icon}</span>
      <span className={`text-lg font-extrabold ${color}`}>{value}</span>
      <span className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold">{label}</span>
    </div>
  );
}

export default function StreakBadge({ data }) {
  const [open, setOpen] = useState(false);
  const { current, next, progress } = getLevelInfo(data.xp);

  const streakMilestone = [...MILESTONES].reverse().find(m => data.streak >= m.streak);

  return (
    <>
      {/* Compact header pill */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-700 hover:border-orange-600 hover:bg-orange-950/30 transition-all group"
      >
        <Flame className={`w-3.5 h-3.5 ${data.streak > 0 ? 'text-orange-400' : 'text-gray-600'}`} />
        <span className={`text-xs font-bold ${data.streak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
          {data.streak}
        </span>
        <span className="text-gray-600 text-xs">|</span>
        <Star className="w-3 h-3 text-violet-400" />
        <span className="text-xs text-violet-400 font-bold">{data.xp}</span>
        <span className="text-gray-500 text-[10px] hidden sm:block">XP</span>
      </button>

      {/* Detail modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1,   y: 0    }}
              exit={{   opacity: 0, scale: 0.9,  y: -20  }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-80 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span className="text-white font-bold">Your Progress</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Level section */}
              <div className="px-5 pb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 mb-3`}>
                  <Trophy className={`w-4 h-4 ${current.color}`} />
                  <span className={`font-bold text-sm ${current.color}`}>Level {current.level} — {current.title}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>{data.xp} XP</span>
                  {next ? <span>{next.min} XP for Level {next.level}</span> : <span>Max Level!</span>}
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500`}
                  />
                </div>
                {next && (
                  <p className="text-gray-600 text-xs mt-1 text-right">
                    {next.min - data.xp} XP to {next.title}
                  </p>
                )}
              </div>

              {/* Stats grid */}
              <div className="px-5 pb-4 grid grid-cols-3 gap-2">
                <StatBox icon="🔥" value={data.streak} label="Streak" color={data.streak > 0 ? 'text-orange-400' : 'text-gray-500'} />
                <StatBox icon="⭐" value={data.xp}     label="Total XP"  color="text-violet-400" />
                <StatBox icon="📚" value={data.totalLessons} label="Lessons" color="text-blue-400" />
              </div>

              {/* Streak milestone */}
              {streakMilestone && (
                <div className="mx-5 mb-4 px-4 py-2.5 rounded-xl bg-orange-950/40 border border-orange-800/60 flex items-center gap-2">
                  <span className="text-xl">{streakMilestone.icon}</span>
                  <div>
                    <p className="text-orange-300 text-xs font-bold">{streakMilestone.label}</p>
                    <p className="text-orange-500 text-[10px]">Keep the streak going!</p>
                  </div>
                </div>
              )}

              {/* XP guide */}
              <div className="mx-5 mb-5 p-3 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold mb-2">How to earn XP</p>
                <div className="space-y-1">
                  {[
                    { icon: '⭐', label: 'New topic lesson', xp: '+150 XP' },
                    { icon: '🔁', label: 'Revisit a topic',  xp: '+25 XP'  },
                    { icon: '🏆', label: 'Perfect quiz',     xp: '+100 XP' },
                    { icon: '📝', label: 'Complete a quiz',  xp: '+50 XP'  },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-400"><span>{r.icon}</span>{r.label}</span>
                      <span className="text-violet-400 font-bold">{r.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
