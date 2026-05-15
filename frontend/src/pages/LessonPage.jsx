import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, Globe, HelpCircle, ChevronRight } from 'lucide-react';
import AnimationPlayer from '../components/AnimationPlayer';
import CodeViewer from '../components/CodeViewer';
import ConceptCard from '../components/ConceptCard';
import WebResults from '../components/WebResults';
import QuizSection from '../components/QuizSection';

const TABS = [
  { id: 'animation', label: 'Animation', icon: BookOpen },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'web', label: 'Web Context', icon: Globe },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
];

export default function LessonPage({ lesson, webResults, topic }) {
  const [activeTab, setActiveTab] = useState('animation');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-5"
    >
      <ConceptCard concept={lesson.concept} lesson={lesson} />

      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1.5">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'animation' && (
            <div className="space-y-4">
              <AnimationPlayer animation={lesson.animation} />
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">How to follow along</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {[
                    { step: '1', text: 'Press Play to start the animation' },
                    { step: '2', text: 'Read each step description carefully' },
                    { step: '3', text: 'Switch to Code tab to see the implementation' },
                  ].map(item => (
                    <div key={item.step} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-6 h-6 rounded-full bg-violet-700 text-white text-xs font-bold flex items-center justify-center shrink-0">{item.step}</span>
                      {item.text}
                      {item.step !== '3' && <ChevronRight className="w-4 h-4 text-gray-600 hidden sm:block" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'code' && <CodeViewer codeExplanation={lesson.codeExplanation} />}
          {activeTab === 'web' && <WebResults webResults={webResults} />}
          {activeTab === 'quiz' && <QuizSection quiz={lesson.quiz} topic={topic} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
