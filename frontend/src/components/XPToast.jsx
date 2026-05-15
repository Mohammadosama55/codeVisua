import { AnimatePresence, motion } from 'framer-motion';

export default function XPToast({ toast }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -20, scale: 0.9  }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-900 border border-violet-700 shadow-2xl shadow-violet-900/40 backdrop-blur-sm"
          >
            <span className="text-2xl">{toast.icon}</span>
            <div>
              <p className="text-white font-bold text-sm">{toast.msg}</p>
              {toast.sub && <p className="text-gray-400 text-xs">{toast.sub}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
