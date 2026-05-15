import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';

const DIFF_COLORS = {
  Beginner:     'text-green-400 bg-green-950 border-green-800',
  Intermediate: 'text-yellow-400 bg-yellow-950 border-yellow-800',
  Advanced:     'text-red-400   bg-red-950   border-red-800',
};

const TYPE_ICONS = {
  array:       '📊', tree: '🌲', 'linked-list': '🔗',
  graph:       '🕸️', sorting: '📶', hash: '🗂️',
  stack:       '📚', queue: '🚶', heap: '⛰️',
  'dp-table':  '🧮', bst: '🌲', default: '💡',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function HistorySidebar({ history, onSelect, onRemove, onClear, currentTopic }) {
  const [open, setOpen] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <>
      {/* Toggle tab — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed top-1/2 -translate-y-1/2 z-50 flex items-center gap-1 px-2 py-4 rounded-l-xl bg-gray-900 border border-gray-700 border-r-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-all shadow-xl"
        style={{ right: open ? '17rem' : 0 }}
      >
        {open ? <ChevronRight className="w-4 h-4" /> : (
          <div className="flex flex-col items-center gap-1.5">
            <ChevronLeft className="w-4 h-4" />
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                {history.length}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-68 z-40 flex flex-col bg-gray-925 border-l border-gray-800 shadow-2xl"
            style={{ width: '17rem', backgroundColor: '#0c0e14' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-violet-400" />
                <span className="text-white font-semibold text-sm">History</span>
                {history.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded-full">{history.length}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Clear all history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Confirm clear */}
            <AnimatePresence>
              {confirmClear && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-gray-800 bg-red-950/30"
                >
                  <div className="px-4 py-3">
                    <p className="text-red-300 text-xs mb-2">Clear all {history.length} items?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onClear(); setConfirmClear(false); }}
                        className="flex-1 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="flex-1 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                  <BookOpen className="w-10 h-10 text-gray-700" />
                  <p className="text-gray-500 text-sm">No lessons yet.</p>
                  <p className="text-gray-600 text-xs">Search for a topic to start learning!</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {history.map((entry, i) => {
                    const isCurrent = entry.topic.toLowerCase() === currentTopic?.toLowerCase();
                    const icon = TYPE_ICONS[entry.animType] || TYPE_ICONS.default;
                    const diffClass = DIFF_COLORS[entry.difficulty] || 'text-gray-400 bg-gray-800 border-gray-700';
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                          isCurrent
                            ? 'bg-violet-950/60 border-violet-700'
                            : 'bg-gray-900/60 border-gray-800 hover:bg-gray-800/80 hover:border-gray-700'
                        }`}
                        onClick={() => onSelect(entry.topic)}
                      >
                        <span className="text-lg mt-0.5 shrink-0">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-violet-200' : 'text-white'}`}>
                            {entry.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`text-xs px-1.5 py-0.5 rounded border ${diffClass}`}>
                              {entry.difficulty}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />{timeAgo(entry.visitedAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); onRemove(entry.id); }}
                          className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-950/40 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {isCurrent && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-400" />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-800">
                <p className="text-xs text-gray-600 text-center">Saved locally · up to 20 topics</p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
