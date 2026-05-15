import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Zap } from 'lucide-react';
import SearchBar from './components/SearchBar';
import LoadingLesson from './components/LoadingLesson';
import LessonPage from './pages/LessonPage';
import HistorySidebar from './components/HistorySidebar';
import { useLesson } from './hooks/useLesson';
import { useHistory } from './hooks/useHistory';

function HeroSection() {
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
    </div>
  );
}

export default function App() {
  const { lesson, webResults, loading, error, fetchLesson } = useLesson();
  const { history, addEntry, removeEntry, clearHistory } = useHistory();
  const [currentTopic, setCurrentTopic] = useState('');

  const handleSearch = async (topic) => {
    setCurrentTopic(topic);
    const data = await fetchLesson(topic);
    if (data?.lesson) addEntry(topic, data.lesson);
  };

  const handleHistorySelect = (topic) => {
    handleSearch(topic);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-5 border-b border-gray-800 mb-8"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            <span className="font-bold text-white">DSALearn</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-950 border border-green-800 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Online
            </span>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {!lesson && !loading && (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HeroSection />
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

      <HistorySidebar
        history={history}
        onSelect={handleHistorySelect}
        onRemove={removeEntry}
        onClear={clearHistory}
        currentTopic={currentTopic}
      />
    </div>
  );
}
