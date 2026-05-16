import { motion } from 'framer-motion';
import { Clock, Zap, Database, Target, RefreshCw, Layers } from 'lucide-react';

export default function ConceptCard({ concept, lesson, cacheInfo, onRefresh }) {
  if (!concept || !lesson) return null;
  const { keyIdeas, timeComplexity, spaceComplexity, useCases } = concept;

  const diffColor = {
    Beginner: 'text-green-400 bg-green-950 border-green-800',
    Intermediate: 'text-yellow-400 bg-yellow-950 border-yellow-800',
    Advanced: 'text-red-400 bg-red-950 border-red-800',
  }[lesson.difficulty] || 'text-gray-400 bg-gray-800 border-gray-700';

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
          <p className="text-gray-400 text-sm mt-1">{lesson.tagline}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${diffColor}`}>
            {lesson.difficulty}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <Clock className="w-3 h-3" /> ~{lesson.timeToLearn} min
          </span>
          {cacheInfo?.lessonFromCache ? (
            <span className="text-xs flex items-center gap-1 bg-blue-950/60 text-blue-400 px-3 py-1 rounded-full border border-blue-800">
              <Layers className="w-3 h-3" /> Cached
            </span>
          ) : (
            <span className="text-xs flex items-center gap-1 bg-green-950/60 text-green-400 px-3 py-1 rounded-full border border-green-800">
              <Zap className="w-3 h-3" /> Fresh
            </span>
          )}
          {cacheInfo?.lessonFromCache && onRefresh && (
            <button
              onClick={onRefresh}
              title="Regenerate fresh lesson"
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-violet-600 pl-4">{lesson.overview}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Time Complexity</span>
          </div>
          {timeComplexity && (
            <div className="space-y-1">
              {['best', 'average', 'worst'].map(k => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-gray-500 capitalize">{k}</span>
                  <span className="font-mono text-violet-300">{timeComplexity[k]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Space</span>
          </div>
          <p className="font-mono text-blue-300 text-sm">{spaceComplexity}</p>
        </div>

        <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Key Ideas</span>
          </div>
          <ul className="space-y-0.5">
            {(keyIdeas || []).slice(0, 3).map((idea, i) => (
              <li key={i} className="text-gray-300 text-xs flex items-start gap-1">
                <span className="text-violet-500 mt-0.5">•</span> {idea}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {useCases?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Real-World Use Cases</p>
          <div className="flex flex-wrap gap-2">
            {useCases.map((uc, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-950 to-blue-950 text-violet-300 border border-violet-800/50"
              >
                {uc}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
