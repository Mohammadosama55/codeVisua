import { motion } from 'framer-motion';

const STEPS = [
  { icon: '🔍', label: 'Analyzing topic...' },
  { icon: '🧠', label: 'Generating explanation with AI...' },
  { icon: '🎬', label: 'Building animation steps...' },
  { icon: '💻', label: 'Writing Python, C++ & Java code...' },
  { icon: '🌐', label: 'Searching the web for examples...' },
  { icon: '📦', label: 'Packaging your lesson...' },
];

export default function LoadingLesson({ topic }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      <div className="relative w-24 h-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-blue-500"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-4 border-transparent border-t-pink-500 border-l-cyan-500"
        />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🎓</div>
      </div>

      <div className="text-center">
        <h3 className="text-white font-bold text-xl mb-1">Creating your lesson</h3>
        <p className="text-violet-400 font-mono text-sm">"{topic}"</p>
      </div>

      <div className="space-y-2 w-full max-w-xs">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.6, duration: 0.4 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.6 + 0.2 }}
            >
              {step.icon}
            </motion.span>
            <span className="text-gray-400 text-sm">{step.label}</span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.6 + 0.4 }}
              className="ml-auto"
            >
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.6 }}
                className="w-2 h-2 rounded-full bg-violet-500"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
