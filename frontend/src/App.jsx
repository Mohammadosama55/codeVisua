import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Zap, Map } from 'lucide-react';
import SearchBar from './components/SearchBar';
import LoadingLesson from './components/LoadingLesson';
import LessonPage from './pages/LessonPage';
import HistorySidebar from './components/HistorySidebar';
import RoadmapView from './components/RoadmapView';
import { useLesson } from './hooks/useLesson';
import { useHistory } from './hooks/useHistory';
import { getNextSuggestions, matchHistoryToTopics } from './data/roadmap';
import { useMemo } from 'react';

function HeroSection({ history, onSearch }) {
  const completedIds = useMemo(() => matchHistoryToTopics(history), [history]);
  const suggestions  = useMemo(() => getNextSuggestions(completedIds, 3), [completedIds]);

  return (
    <div className="text-center space-y-4 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-2xl shadow-violet-900/50 mx-auto"
      >
        <GraduationCap className="w-10 h-10 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-5xl font-extrabold text-white"
      >
        DSA<span className="text-violet-400">Learn</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-lg max-w-xl mx-auto"
      >
        Search any Data Structure or Algorithm — get an AI-generated lesson with
        <span className="text-violet-300"> animated visualization</span>,
        <span className="text-blue-300"> multi-language code</span>, and
        <span className="text-green-300"> live web context</span>.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap"
      >
        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> Powered by Groq + Llama 3</span>
        <span className="text-gray-700">•</span>
        <span className="flex items-center gap-1">🌐 Tavily web search</span>
        <span className="text-gray-700">•</span>
        <span className="flex items-center gap-1">💯 100% Free</span>
      </motion.div>

      {/* Roadmap suggestions on homepage */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <p className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-1.5">
            <Map className="w-3 h-3 text-violet-400" />
            Suggested for you based on your roadmap
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {suggestions.map(s => (
              <button
                key={s.id}
                onClick={() => onSearch(s.title)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-700 hover:bg-violet-900 hover:border-violet-500 transition-all"
              >
                <span>{s.icon}</span> {s.title}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  const { lesson, webResults, loading, error, fetchLesson } = useLesson();
  const { history, addEntry, removeEntry, clearHistory } = useHistory();
  const [currentTopic, setCurrentTopic]   = useState('');
  const [showRoadmap, setShowRoadmap]     = useState(false);

  const handleSearch = async (topic) => {
    setShowRoadmap(false);
    setCurrentTopic(topic);
    const data = await fetchLesson(topic);
    if (data?.lesson) addEntry(topic, data.lesson);
  };

  const completedIds = useMemo(() => matchHistoryToTopics(history), [history]);
  const totalTopics  = 57;
  const overallPct   = Math.round((completedIds.size / totalTopics) * 100);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 pb-16">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-5 border-b border-gray-800 mb-8"
        >
          <button
            onClick={() => { setShowRoadmap(false); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <GraduationCap className="w-6 h-6 text-violet-400" />
            <span className="font-bold text-white">DSALearn</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Roadmap progress pill */}
            <button
              onClick={() => setShowRoadmap(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-700 hover:border-violet-600 hover:bg-violet-950/40 transition-all group"
            >
              <Map className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-gray-400 group-hover:text-violet-300 transition-colors">Roadmap</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
                </div>
                <span className="text-xs text-violet-400 font-semibold">{overallPct}%</span>
              </div>
            </button>

            {/* Mobile roadmap button */}
            <button
              onClick={() => setShowRoadmap(true)}
              className="sm:hidden p-2 rounded-xl bg-gray-900 border border-gray-700 text-violet-400"
            >
              <Map className="w-4 h-4" />
            </button>

            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-950 border border-green-800 text-green-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Online
            </span>
          </div>
        </motion.header>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {!lesson && !loading && (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HeroSection history={history} onSearch={handleSearch} />
              <div className="mt-8">
                <SearchBar onSearch={handleSearch} loading={loading} />
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingLesson topic={currentTopic} />
            </motion.div>
          )}

          {lesson && !loading && (
            <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <SearchBar onSearch={handleSearch} loading={loading} />
              </div>
              {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-sm text-center">
                  {error}
                </div>
              )}
              <LessonPage lesson={lesson} webResults={webResults} topic={currentTopic} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History sidebar */}
      <HistorySidebar
        history={history}
        onSelect={handleSearch}
        onRemove={removeEntry}
        onClear={clearHistory}
        currentTopic={currentTopic}
      />

      {/* Roadmap overlay */}
      <AnimatePresence>
        {showRoadmap && (
          <RoadmapView
            history={history}
            onSelect={handleSearch}
            onClose={() => setShowRoadmap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
