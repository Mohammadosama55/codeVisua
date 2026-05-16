import { motion } from 'framer-motion';
import { Globe, ExternalLink, Lightbulb, Layers, Zap } from 'lucide-react';

export default function WebResults({ webResults }) {
  if (!webResults) return null;
  const { answer, sources, fromCache, cachedTopic } = webResults;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="text-white font-semibold text-sm">Web Context</span>
        <div className="ml-auto flex items-center gap-2">
          {fromCache ? (
            <span className="flex items-center gap-1 text-xs bg-blue-950/60 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800">
              <Layers className="w-3 h-3" />
              {cachedTopic ? `Cached: "${cachedTopic}"` : 'Cached'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs bg-green-950/60 text-green-400 px-2 py-0.5 rounded-full border border-green-800">
              <Zap className="w-3 h-3" /> Live search
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">AI Answer from Web</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}

        {sources?.length > 0 && (
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-3 font-semibold">Sources</p>
            <div className="space-y-2">
              {sources.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition-all group"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-white text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{s.title}</p>
                      <ExternalLink className="w-3 h-3 text-gray-500 shrink-0" />
                    </div>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{s.snippet}</p>
                    <p className="text-gray-600 text-xs mt-1 truncate">{s.url}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
