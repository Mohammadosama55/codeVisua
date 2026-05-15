import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

/* ─── individual visualisation components ─── */

function ArrayViz({ data, highlight }) {
  const nums = data.filter(v => typeof v === 'number');
  const max  = Math.max(...nums, 1);
  return (
    <div className="flex items-end justify-center gap-2 h-52 px-4 w-full">
      {data.map((val, i) => {
        const active = highlight === i || highlight === String(i) || highlight === val || highlight === String(val);
        const h = typeof val === 'number' ? Math.max(18, (val / max) * 170) : 36;
        return (
          <motion.div key={i} layout className="flex flex-col items-center gap-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <span className={`text-xs font-bold ${active ? 'text-violet-300' : 'text-gray-400'}`}>{val}</span>
            <motion.div
              animate={{ height: h, backgroundColor: active ? '#7c3aed' : '#374151', boxShadow: active ? '0 0 12px #7c3aed88' : 'none' }}
              transition={{ duration: 0.35 }}
              className="w-9 rounded-t-md"
              style={{ height: h }}
            />
            <span className="text-[10px] text-gray-600">{i}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function TreeViz({ data, highlight }) {
  const nodes = Array.isArray(data) ? data.filter(v => v !== null && v !== undefined) : [];
  const levels = [];
  let levelSize = 1, idx = 0;
  while (idx < nodes.length) {
    levels.push(nodes.slice(idx, idx + levelSize));
    idx += levelSize;
    levelSize *= 2;
  }
  return (
    <div className="flex flex-col items-center gap-5 py-6 min-h-52 w-full">
      {levels.map((level, li) => (
        <div key={li} className="flex justify-center" style={{ gap: `${Math.max(12, 56 - li * 14)}px` }}>
          {level.map((val, ni) => {
            const globalIdx = levels.slice(0, li).reduce((s, l) => s + l.length, 0) + ni;
            const active = highlight === val || highlight === String(val) || highlight === globalIdx || highlight === String(globalIdx);
            return (
              <motion.div
                key={ni}
                animate={{ scale: active ? 1.25 : 1, backgroundColor: active ? '#6d28d9' : '#1f2937', boxShadow: active ? '0 0 14px #7c3aed99' : 'none' }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold border-2"
                style={{ borderColor: active ? '#8b5cf6' : '#4b5563' }}
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
    <div className="flex items-center justify-center flex-wrap gap-0 py-10 px-4 w-full">
      {nodes.map((val, i) => {
        const active = highlight === i || highlight === val || highlight === String(i) || highlight === String(val);
        return (
          <div key={i} className="flex items-center">
            <motion.div
              animate={{ backgroundColor: active ? '#6d28d9' : '#1f2937', scale: active ? 1.1 : 1, boxShadow: active ? '0 0 12px #7c3aed88' : 'none' }}
              transition={{ duration: 0.3 }}
              className="px-4 py-2 rounded-xl border-2 text-white font-mono text-sm font-bold"
              style={{ borderColor: active ? '#8b5cf6' : '#4b5563' }}
            >
              {val}
            </motion.div>
            {i < nodes.length - 1 && (
              <div className="flex items-center gap-0 mx-1">
                <div className="h-0.5 w-5 bg-gray-600" />
                <div className="border-t-4 border-r-0 border-b-4 border-l-4 border-transparent border-l-gray-500 w-0 h-0" style={{ borderWidth: '4px 0 4px 6px', borderColor: 'transparent transparent transparent #6b7280' }} />
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center">
        <div className="h-0.5 w-5 bg-gray-600 ml-1" />
        <div className="px-3 py-2 rounded-xl border-2 border-dashed border-gray-600 text-gray-500 text-xs ml-0.5">NULL</div>
      </div>
    </div>
  );
}

function StackViz({ data, highlight }) {
  const items = Array.isArray(data) ? [...data].reverse() : [];
  return (
    <div className="flex flex-col items-center gap-1 py-4 min-h-52 justify-center w-full">
      <span className="text-[10px] text-violet-400 mb-1 uppercase tracking-widest font-semibold">TOP</span>
      {items.map((val, i) => {
        const origIdx = data.length - 1 - i;
        const active = highlight === origIdx || highlight === val || highlight === String(origIdx) || highlight === String(val);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, backgroundColor: active ? '#6d28d9' : '#1f2937', boxShadow: active ? '0 0 10px #7c3aed77' : 'none' }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="px-12 py-2.5 border-2 rounded text-white font-mono text-sm font-bold text-center min-w-36"
            style={{ borderColor: active ? '#8b5cf6' : '#4b5563' }}
          >
            {val}
          </motion.div>
        );
      })}
      <div className="w-44 h-1 bg-gray-600 rounded mt-1" />
    </div>
  );
}

function QueueViz({ data, highlight }) {
  const items = Array.isArray(data) ? data : [];
  return (
    <div className="flex flex-col items-center py-4 min-h-52 justify-center w-full gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-green-400 uppercase tracking-widest font-semibold">FRONT</span>
        {items.map((val, i) => {
          const active = highlight === i || highlight === val || highlight === String(i) || highlight === String(val);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, backgroundColor: active ? '#6d28d9' : '#1f2937', boxShadow: active ? '0 0 10px #7c3aed77' : 'none' }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="px-4 py-2.5 border-2 rounded text-white font-mono text-sm font-bold text-center min-w-12"
              style={{ borderColor: active ? '#8b5cf6' : '#4b5563' }}
            >
              {val}
            </motion.div>
          );
        })}
        <span className="text-[10px] text-orange-400 uppercase tracking-widest font-semibold">REAR</span>
      </div>
    </div>
  );
}

function HashViz({ data, highlight }) {
  const entries = Array.isArray(data)
    ? data.map((v, i) => ({ key: i, val: v }))
    : Object.entries(data || {}).map(([k, v]) => ({ key: k, val: v }));
  return (
    <div className="grid grid-cols-2 gap-2 py-4 px-6 max-w-sm mx-auto w-full">
      {entries.map(({ key, val }, i) => {
        const active = highlight === key || highlight === String(key) || highlight === i;
        return (
          <motion.div
            key={i}
            animate={{ backgroundColor: active ? '#4c1d95' : '#111827', borderColor: active ? '#8b5cf6' : '#374151', boxShadow: active ? '0 0 10px #7c3aed55' : 'none' }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 p-2.5 rounded-lg border text-sm"
          >
            <span className="text-violet-400 font-mono font-bold min-w-8">[{key}]</span>
            <span className="text-white font-mono">{String(val)}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function GraphViz({ data, highlight }) {
  const nodes = Array.isArray(data) ? data : [];
  const n = nodes.length;
  const cx = 130, cy = 100, r = 80;
  const positions = nodes.map((_, i) => ({
    x: cx + r * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
    y: cy + r * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
  }));
  return (
    <div className="flex items-center justify-center py-4 w-full">
      <svg width={260} height={200} className="overflow-visible">
        {nodes.map((_, i) =>
          nodes.slice(i + 1).map((__, j) => (
            <line key={`${i}-${i+1+j}`}
              x1={positions[i].x} y1={positions[i].y}
              x2={positions[i+1+j].x} y2={positions[i+1+j].y}
              stroke="#374151" strokeWidth={1.5}
            />
          ))
        )}
        {nodes.map((val, i) => {
          const active = highlight === val || highlight === String(val) || highlight === i || highlight === String(i);
          return (
            <g key={i}>
              <motion.circle
                cx={positions[i].x} cy={positions[i].y} r={20}
                animate={{ fill: active ? '#6d28d9' : '#1f2937' }}
                stroke={active ? '#8b5cf6' : '#4b5563'} strokeWidth={2}
              />
              <text x={positions[i].x} y={positions[i].y + 5} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold">{val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DPTableViz({ data, highlight }) {
  const rows = Array.isArray(data[0]) ? data : [data];
  return (
    <div className="flex items-center justify-center py-4 w-full overflow-x-auto">
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((val, ci) => {
              const active = highlight === `${ri},${ci}` || highlight === ci || highlight === String(ci);
              return (
                <motion.div
                  key={ci}
                  animate={{ backgroundColor: active ? '#6d28d9' : '#1f2937', borderColor: active ? '#8b5cf6' : '#374151' }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 flex items-center justify-center text-white text-sm font-mono font-bold border rounded"
                >
                  {val}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericViz({ data, highlight }) {
  const items = Array.isArray(data) ? data : typeof data === 'object' && data ? Object.values(data) : [data];
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap py-8 px-4 w-full">
      {items.map((val, i) => {
        const active = highlight === i || highlight === val || highlight === String(i) || highlight === String(val);
        return (
          <motion.div
            key={i}
            animate={{ scale: active ? 1.2 : 1, backgroundColor: active ? '#6d28d9' : '#1f2937', boxShadow: active ? '0 0 14px #7c3aed88' : 'none' }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold border-2 text-sm"
            style={{ borderColor: active ? '#a78bfa' : '#374151' }}
          >
            {String(val)}
          </motion.div>
        );
      })}
    </div>
  );
}

function Viz({ type, data, highlight, step }) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-52 text-gray-600 text-sm">
        No data to visualise
      </div>
    );
  }
  const t = (type || '').toLowerCase();
  if (t.includes('sort') || t.includes('array') || t.includes('search')) return <ArrayViz data={data} highlight={highlight} />;
  if (t.includes('dp') || t.includes('table'))   return <DPTableViz data={data} highlight={highlight} />;
  if (t.includes('tree') || t.includes('bst') || t.includes('heap')) return <TreeViz data={data} highlight={highlight} />;
  if (t.includes('linked'))  return <LinkedListViz data={data} highlight={highlight} />;
  if (t.includes('stack'))   return <StackViz data={data} highlight={highlight} />;
  if (t.includes('queue'))   return <QueueViz data={data} highlight={highlight} />;
  if (t.includes('hash'))    return <HashViz data={data} highlight={highlight} />;
  if (t.includes('graph'))   return <GraphViz data={data} highlight={highlight} />;
  return <GenericViz data={data} highlight={highlight} />;
}

/* ─── main player ─── */

export default function AnimationPlayer({ animation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const intervalRef = useRef(null);

  const steps      = animation?.steps || [];
  const totalSteps = steps.length;
  const step       = steps[currentStep] || {};

  // Use the per-step data snapshot; fall back to initialData
  const vizData = step.data ?? animation?.initialData ?? [];

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

  if (!animation || totalSteps === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center h-64 text-gray-500">
        No animation data available.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* toolbar */}
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-3 text-gray-400 text-xs font-mono">{animation.type ?? 'animation'}.viz</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="mr-1">Speed:</span>
          {[{ label: '0.5×', val: 2500 }, { label: '1×', val: 1500 }, { label: '1.5×', val: 900 }, { label: '2×', val: 500 }].map(s => (
            <button key={s.val} onClick={() => setSpeed(s.val)}
              className={`px-2 py-0.5 rounded transition-colors ${speed === s.val ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* visualisation area — key on currentStep so Framer re-mounts cleanly */}
      <div className="min-h-56 flex items-center justify-center px-4 py-2 bg-gray-950/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Viz type={animation.type} data={vizData} highlight={step.highlight} step={step} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* step info + controls */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-950">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-violet-400 font-mono bg-violet-950/50 px-2 py-0.5 rounded-full">
                {currentStep + 1} / {totalSteps}
              </span>
              <span className="text-white font-semibold text-sm">{step.title}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            {step.state && (
              <p className="text-gray-500 text-xs mt-1.5 font-mono bg-gray-900 px-2.5 py-1 rounded-lg inline-block border border-gray-800">
                {step.state}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* progress bar */}
        <div className="mb-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="h-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-full"
            transition={{ duration: 0.3 }} />
        </div>

        {/* controls */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { setCurrentStep(0); setPlaying(false); }}
            title="Restart"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}
            title="Previous step"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition-colors">
            <SkipBack className="w-4 h-4 scale-x-[-1]" />
          </button>

          <button onClick={() => setPlaying(p => !p)}
            className="px-7 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-violet-900/40">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Pause' : 'Play'}
          </button>

          <button onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))} disabled={currentStep === totalSteps - 1}
            title="Next step"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
          <button onClick={() => { setCurrentStep(totalSteps - 1); setPlaying(false); }}
            title="Jump to end"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
