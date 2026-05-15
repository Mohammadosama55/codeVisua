import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, BookOpen, FlaskConical, Cpu, AlertTriangle, ChevronDown, ChevronUp, Play } from 'lucide-react';

const SECTION_META = [
  { key: 'hook',              icon: '🎬', label: 'Hook',                color: 'from-pink-950 to-rose-950',   border: 'border-pink-800',    text: 'text-pink-300'   },
  { key: 'definition',        icon: '📖', label: 'Definition',          color: 'from-blue-950 to-indigo-950', border: 'border-blue-800',    text: 'text-blue-300'   },
  { key: 'analogy',           icon: '🌍', label: 'Real-World Analogy',  color: 'from-green-950 to-teal-950',  border: 'border-green-800',   text: 'text-green-300'  },
  { key: 'example',           icon: '💡', label: 'Concrete Example',    color: 'from-yellow-950 to-amber-950',border: 'border-yellow-800',  text: 'text-yellow-300' },
  { key: 'logicSteps',        icon: '🧠', label: 'The Logic',           color: 'from-violet-950 to-purple-950',border: 'border-violet-800', text: 'text-violet-300' },
  { key: 'internalExecution', icon: '⚙️', label: 'Under the Hood',      color: 'from-orange-950 to-red-950',  border: 'border-orange-800',  text: 'text-orange-300' },
  { key: 'commonMistakes',    icon: '⚠️', label: 'Common Mistakes',     color: 'from-red-950 to-rose-950',    border: 'border-red-800',     text: 'text-red-300'    },
];

function SectionBlock({ meta, content, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const renderContent = () => {
    if (Array.isArray(content)) {
      return (
        <ol className="space-y-2 mt-2">
          {content.map((item, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold bg-gray-800 border ${meta.border} ${meta.text} mt-0.5`}>
                {i + 1}
              </span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ol>
      );
    }

    if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-2 mt-2">
          {Object.entries(content).map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className={`font-semibold ${meta.text}`}>{k}: </span>
              <span className="text-gray-300">{v}</span>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-gray-300 text-sm leading-relaxed mt-2 whitespace-pre-wrap">{content}</p>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{meta.icon}</span>
          <span className={`font-bold text-sm ${meta.text}`}>{meta.label}</span>
        </div>
        {open ? <ChevronUp className={`w-4 h-4 ${meta.text} opacity-60`} /> : <ChevronDown className={`w-4 h-4 ${meta.text} opacity-60`} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ExecutionTrace({ steps }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [running, setRunning]     = useState(false);

  const step = steps[activeIdx];

  const play = () => {
    setRunning(true);
    let i = activeIdx;
    const iv = setInterval(() => {
      i++;
      if (i >= steps.length) { clearInterval(iv); setRunning(false); return; }
      setActiveIdx(i);
    }, 900);
  };

  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* trace steps */}
      <div className="space-y-1.5">
        {steps.map((s, i) => {
          const isActive = i === activeIdx;
          const isPast   = i < activeIdx;
          return (
            <motion.button
              key={i}
              onClick={() => setActiveIdx(i)}
              animate={{ backgroundColor: isActive ? '#1e1b4b' : isPast ? '#111827' : 'transparent' }}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                isActive ? 'border-violet-600 text-violet-200' : isPast ? 'border-gray-800 text-gray-500' : 'border-transparent text-gray-600 hover:border-gray-700 hover:text-gray-400'
              }`}
            >
              <span className={`mr-2 ${isActive ? 'text-violet-400' : 'text-gray-700'}`}>
                {isActive ? '▶' : isPast ? '✓' : '○'}
              </span>
              {typeof s === 'string' ? s : s.step || s.line || JSON.stringify(s)}
            </motion.button>
          );
        })}
      </div>

      {/* Play button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => { setActiveIdx(0); setTimeout(play, 100); }}
          disabled={running}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-600 disabled:opacity-40 text-white text-xs font-semibold transition-colors"
        >
          <Play className="w-3 h-3" /> {running ? 'Running…' : 'Replay'}
        </button>
        <span className="text-gray-600 text-xs">{activeIdx + 1} / {steps.length}</span>
      </div>
    </div>
  );
}

export default function DeepDiveSection({ deepDive }) {
  if (!deepDive) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
        Deep Dive content not available for this topic yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-950/60 to-blue-950/60 rounded-xl border border-violet-800/50">
        <span className="text-2xl">🎓</span>
        <div>
          <p className="text-white font-bold text-sm">YouTuber-Style Deep Dive</p>
          <p className="text-gray-400 text-xs">Define → Example → Logic → Under the Hood</p>
        </div>
      </div>

      {SECTION_META.map((meta, i) => {
        const content = deepDive[meta.key];
        if (!content) return null;

        if (meta.key === 'internalExecution' && Array.isArray(content)) {
          return (
            <motion.div
              key={meta.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.border} overflow-hidden`}
            >
              <div className="px-5 py-3.5 flex items-center gap-3">
                <span className="text-xl">{meta.icon}</span>
                <span className={`font-bold text-sm ${meta.text}`}>{meta.label}</span>
                <span className="text-gray-600 text-xs ml-auto">Click steps or press Replay</span>
              </div>
              <div className="px-5 pb-5">
                <ExecutionTrace steps={content} />
              </div>
            </motion.div>
          );
        }

        return (
          <SectionBlock
            key={meta.key}
            meta={meta}
            content={content}
            defaultOpen={i <= 2}
          />
        );
      })}
    </div>
  );
}
