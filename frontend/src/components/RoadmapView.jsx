import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles, ChevronDown, ChevronUp, Map, X, ArrowRight, Trophy, Target } from 'lucide-react';
import { TRACKS, getTopicStatus, getNextSuggestions, matchHistoryToTopics } from '../data/roadmap';

const DIFF_STYLE = {
  Beginner:     { dot: 'bg-green-400',  text: 'text-green-400',  label: 'Beginner' },
  Intermediate: { dot: 'bg-yellow-400', text: 'text-yellow-400', label: 'Inter.' },
  Advanced:     { dot: 'bg-red-400',    text: 'text-red-400',    label: 'Adv.' },
};

function TopicNode({ topic, status, onSelect, track }) {
  const isCompleted = status === 'completed';
  const isLocked    = status === 'locked';
  const isAvailable = status === 'available';

  const diff = DIFF_STYLE[topic.difficulty] || DIFF_STYLE.Beginner;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!isLocked ? { scale: 1.04, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.97 } : {}}
      onClick={() => !isLocked && onSelect(topic.title)}
      disabled={isLocked}
      className={`relative flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all w-full ${
        isCompleted
          ? 'bg-green-950/40 border-green-700 cursor-pointer shadow-lg shadow-green-900/20'
          : isAvailable
          ? `${track.bgColor} ${track.borderColor} border cursor-pointer shadow-lg hover:shadow-xl`
          : 'bg-gray-900/40 border-gray-800 cursor-not-allowed opacity-50'
      }`}
    >
      {/* Status icon */}
      <div className="shrink-0 mt-0.5">
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        ) : isLocked ? (
          <Lock className="w-3.5 h-3.5 text-gray-600 mt-0.5" />
        ) : (
          <span className="text-base leading-none">{topic.icon}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-tight ${
          isCompleted ? 'text-green-300' : isAvailable ? 'text-white' : 'text-gray-500'
        }`}>
          {topic.title}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-400' : isLocked ? 'bg-gray-600' : diff.dot}`} />
          <span className={`text-[10px] ${isCompleted ? 'text-green-500' : isLocked ? 'text-gray-600' : diff.text}`}>
            {diff.label}
          </span>
        </div>
      </div>

      {isAvailable && (
        <Sparkles className={`w-3 h-3 shrink-0 mt-0.5 ${track.textColor} opacity-70`} />
      )}
      {isCompleted && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.button>
  );
}

function TrackSection({ track, completedIds, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const statuses = track.topics.map(t => getTopicStatus(t.id, completedIds));
  const completedCount = statuses.filter(s => s === 'completed').length;
  const availableCount = statuses.filter(s => s === 'available').length;
  const progress = Math.round((completedCount / track.topics.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-xl">{track.icon}</span>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-sm ${track.textColor}`}>{track.label}</span>
            <span className="text-xs text-gray-500">{track.topics.length} topics</span>
            {availableCount > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${track.bgColor} ${track.textColor} border ${track.borderColor} font-semibold`}>
                {availableCount} ready
              </span>
            )}
            {completedCount === track.topics.length && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-700 font-semibold flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5" /> Done!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-gray-500 shrink-0">{completedCount}/{track.topics.length}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {track.topics.map((topic, i) => (
                <TopicNode
                  key={topic.id}
                  topic={topic}
                  status={statuses[i]}
                  onSelect={onSelect}
                  track={track}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NextUpBanner({ suggestions, completedIds, onSelect, track }) {
  if (!suggestions.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-violet-950/80 to-blue-950/80 border border-violet-700/60 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-violet-400" />
        <span className="text-white font-bold text-sm">Recommended Next</span>
        <span className="text-xs text-violet-400 bg-violet-950 px-2 py-0.5 rounded-full border border-violet-800">
          Based on your progress
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {suggestions.map((topic, i) => {
          const trackData = TRACKS.find(t => t.id === topic.track);
          return (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(topic.title)}
              className={`flex flex-col items-start gap-2 p-3 rounded-xl border ${trackData?.bgColor} ${trackData?.borderColor} hover:brightness-125 transition-all text-left`}
            >
              <span className="text-xl">{topic.icon}</span>
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{topic.title}</p>
                <p className={`text-[10px] mt-0.5 ${trackData?.textColor}`}>{trackData?.label}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <ArrowRight className="w-3 h-3" /> Learn now
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function RoadmapView({ history, onSelect, onClose }) {
  const completedIds = useMemo(() => matchHistoryToTopics(history), [history]);
  const suggestions = useMemo(() => getNextSuggestions(completedIds, 4), [completedIds]);

  const totalTopics = TRACKS.reduce((s, t) => s + t.topics.length, 0);
  const totalCompleted = completedIds.size;
  const overallProgress = Math.round((totalCompleted / totalTopics) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto px-4 py-6 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-xl">Learning Roadmap</h2>
              <p className="text-gray-400 text-xs">{totalTopics} topics across {TRACKS.length} tracks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold text-sm">Overall Progress</span>
            <span className="text-violet-400 font-bold text-lg">{overallProgress}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400 rounded-full"
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-semibold">{totalCompleted}</span> completed
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-400 font-semibold">{suggestions.length}</span> ready to learn
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-gray-400 font-semibold">{totalTopics - totalCompleted - suggestions.length}</span> locked
            </span>
          </div>
        </motion.div>

        {/* Next up banner */}
        <div className="mb-5">
          <NextUpBanner suggestions={suggestions} completedIds={completedIds} onSelect={onSelect} />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 flex-wrap px-1">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Completed</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-400" /> Available — click to learn</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-gray-600" /> Complete prerequisites first</span>
        </div>

        {/* Track sections */}
        <div className="space-y-3">
          {TRACKS.map((track, i) => (
            <motion.div key={track.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <TrackSection track={track} completedIds={completedIds} onSelect={onSelect} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
