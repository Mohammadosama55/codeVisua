import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ChevronRight } from 'lucide-react';

function ArrayViz({ data, highlight }) {
  return (
    <div className="flex items-end justify-center gap-2 h-48 px-4">
      {data.map((val, i) => {
        const isActive = highlight === i || highlight === String(i);
        const height = typeof val === 'number' ? Math.max(20, (val / Math.max(...data)) * 160) : 40;
        return (
          <motion.div
            key={i}
            layout
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-xs text-gray-400">{val}</span>
            <motion.div
              animate={{ height, backgroundColor: isActive ? '#8b5cf6' : '#374151' }}
              transition={{ duration: 0.4 }}
              className="w-10 rounded-t-md"
              style={{ height }}
            />
            <span className="text-xs text-gray-500">{i}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function TreeViz({ data, highlight }) {
  const nodes = Array.isArray(data) ? data : Object.values(data || {});
  const levels = [];
  let levelSize = 1;
  let idx = 0;
  while (idx < nodes.length) {
    levels.push(nodes.slice(idx, idx + levelSize));
    idx += levelSize;
    levelSize *= 2;
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 min-h-48">
      {levels.map((level, li) => (
        <div key={li} className="flex justify-center gap-4" style={{ gap: `${Math.max(8, 48 - li * 12)}px` }}>
          {level.map((val, ni) => {
            const nodeId = levels.slice(0, li).reduce((s, l) => s + l.length, 0) + ni;
            const isActive = highlight === val || highlight === String(val) || highlight === nodeId;
            return (
              <motion.div
                key={ni}
                animate={{ scale: isActive ? 1.2 : 1, backgroundColor: isActive ? '#8b5cf6' : '#1f2937' }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold border-2"
                style={{ borderColor: isActive ? '#8b5cf6' : '#4b5563' }}
              >
                {val}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function LinkedListViz({ data, highlight }) {
  const nodes = Array.isArray(data) ? data : [];
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap py-8 px-4">
      {nodes.map((val, i) => {
        const isActive = highlight === i || highlight === val || highlight === String(i);
        return (
          <div key={i} className="flex items-center gap-1">
            <motion.div
              animate={{ backgroundColor: isActive ? '#8b5cf6' : '#1f2937', scale: isActive ? 1.1 : 1 }}
              className="px-4 py-2 rounded-lg border-2 text-white font-mono text-sm font-bold"
              style={{ borderColor: isActive ? '#8b5cf6' : '#4b5563' }}
            >
              {val}
            </motion.div>
            {i < nodes.length - 1 && (
              <ChevronRight className="text-gray-500 w-4 h-4" />
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-1">
        <ChevronRight className="text-gray-500 w-4 h-4" />
        <div className="px-3 py-2 rounded-lg border-2 border-dashed border-gray-600 text-gray-500 text-sm">NULL</div>
      </div>
    </div>
  );
}

function StackQueueViz({ data, type, highlight }) {
  const items = Array.isArray(data) ? data : [];
  const isStack = type === 'stack';
  const displayed = isStack ? [...items].reverse() : items;
  return (
    <div className="flex flex-col items-center gap-1 py-4">
      {isStack && <span className="text-xs text-violet-400 mb-1">← TOP</span>}
      {!isStack && <span className="text-xs text-violet-400 mb-1">FRONT →</span>}
      {displayed.map((val, i) => {
        const origIdx = isStack ? items.length - 1 - i : i;
        const isActive = highlight === origIdx || highlight === val;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isStack ? 20 : -20 }}
            animate={{ opacity: 1, x: 0, backgroundColor: isActive ? '#8b5cf6' : '#1f2937' }}
            className="px-8 py-2 rounded border-2 text-white font-mono text-sm font-bold min-w-24 text-center"
            style={{ borderColor: isActive ? '#8b5cf6' : '#4b5563' }}
          >
            {val}
          </motion.div>
        );
      })}
      {!isStack && <span className="text-xs text-violet-400 mt-1">← REAR</span>}
    </div>
  );
}

function HashTableViz({ data, highlight }) {
  const entries = Array.isArray(data)
    ? data.map((v, i) => ({ key: i, val: v }))
    : Object.entries(data || {}).map(([k, v]) => ({ key: k, val: v }));
  return (
    <div className="grid grid-cols-2 gap-2 py-4 px-8 max-w-sm mx-auto">
      {entries.map(({ key, val }, i) => {
        const isActive = highlight === key || highlight === String(key) || highlight === i;
        return (
          <motion.div
            key={i}
            animate={{ backgroundColor: isActive ? '#4c1d95' : '#111827' }}
            className="flex items-center gap-2 p-2 rounded border border-gray-700 text-sm"
          >
            <span className="text-violet-400 font-mono font-bold min-w-8">[{key}]</span>
            <span className="text-white font-mono">{val}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function GenericViz({ data, highlight, stepTitle }) {
  const items = Array.isArray(data) ? data : typeof data === 'object' ? Object.values(data) : [data];
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap py-8 px-4">
      {items.map((val, i) => {
        const isActive = highlight === i || highlight === val || highlight === String(i);
        return (
          <motion.div
            key={i}
            animate={{ scale: isActive ? 1.15 : 1, backgroundColor: isActive ? '#8b5cf6' : '#1f2937' }}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold border-2"
            style={{ borderColor: isActive ? '#a78bfa' : '#374151' }}
          >
            {val}
          </motion.div>
        );
      })}
    </div>
  );
}

function VisualizationRenderer({ type, data, highlight, step }) {
  const t = (type || '').toLowerCase();
  if (t.includes('sort') || t.includes('array')) return <ArrayViz data={data} highlight={highlight} />;
  if (t.includes('tree') || t.includes('bst') || t.includes('heap')) return <TreeViz data={data} highlight={highlight} />;
  if (t.includes('linked')) return <LinkedListViz data={data} highlight={highlight} />;
  if (t.includes('stack')) return <StackQueueViz data={data} type="stack" highlight={highlight} />;
  if (t.includes('queue')) return <StackQueueViz data={data} type="queue" highlight={highlight} />;
  if (t.includes('hash')) return <HashTableViz data={data} highlight={highlight} />;
  return <GenericViz data={data} highlight={highlight} stepTitle={step?.title} />;
}

export default function AnimationPlayer({ animation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const intervalRef = useRef(null);

  const steps = animation?.steps || [];
  const totalSteps = steps.length;
  const step = steps[currentStep] || {};

  useEffect(() => {
    setCurrentStep(0);
    setPlaying(false);
  }, [animation]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(s => {
          if (s >= totalSteps - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, totalSteps]);

  const vizData = animation?.initialData || [];

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-gray-400 text-sm font-mono">animation.viz</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Speed:</span>
          {[2000, 1500, 1000, 600].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded ${speed === s ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
              {s === 2000 ? '0.5x' : s === 1500 ? '1x' : s === 1000 ? '1.5x' : '2x'}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-64 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <VisualizationRenderer type={animation?.type} data={vizData} highlight={step.highlight} step={step} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t border-gray-800 bg-gray-950">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-violet-400 font-mono">Step {currentStep + 1}/{totalSteps}</span>
              <span className="text-white font-semibold text-sm">{step.title}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            {step.state && (
              <p className="text-gray-500 text-xs mt-1 font-mono bg-gray-900 px-2 py-1 rounded inline-block">{step.state}</p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mb-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="h-full bg-violet-600 rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { setCurrentStep(0); setPlaying(false); }}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition-colors">
            <SkipBack className="w-4 h-4 scale-x-[-1]" />
          </button>
          <button onClick={() => setPlaying(p => !p)}
            className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2 transition-colors">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))}
            disabled={currentStep === totalSteps - 1}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
          <button onClick={() => { setCurrentStep(totalSteps - 1); setPlaying(false); }}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
