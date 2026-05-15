import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, Globe, HelpCircle, ChevronRight, Telescope, StickyNote } from 'lucide-react';
import AnimationPlayer from '../components/AnimationPlayer';
import CodeViewer from '../components/CodeViewer';
import ConceptCard from '../components/ConceptCard';
import WebResults from '../components/WebResults';
import QuizSection from '../components/QuizSection';
import DeepDiveSection from '../components/DeepDiveSection';
import AskAI from '../components/AskAI';
import { useNotes } from '../hooks/useNotes';

export default function LessonPage({ lesson, webResults, topic, onQuizComplete }) {
  const [activeTab, setActiveTab] = useState('animation');
  const { getNote, setNote, noteCount } = useNotes(topic);

  const lessonContext = lesson
    ? `Title: ${lesson.title}. Overview: ${lesson.overview}. Key ideas: ${(lesson.concept?.keyIdeas || []).join(', ')}.`
    : '';

  const TABS = [
    { id: 'animation', label: 'Animation',  icon: BookOpen   },
    { id: 'deepdive',  label: 'Deep Dive',  icon: Telescope  },
    { id: 'code',      label: 'Code',       icon: Code2      },
    { id: 'web',       label: 'Web',        icon: Globe      },
    { id: 'quiz',      label: 'Quiz',       icon: HelpCircle },
    {
      id: 'notes',
      label: 'Notes',
      icon: StickyNote,
      badge: noteCount > 0 ? noteCount : null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-5"
    >
      <ConceptCard concept={lesson.concept} lesson={lesson} />

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1.5 overflow-x-auto scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-yellow-500 text-black text-[9px] font-bold flex items-center justify-center">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
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
              <AnimationPlayer
                animation={lesson.animation}
                topic={topic}
                getNote={getNote}
                setNote={setNote}
              />
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">How to follow along</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {[
                    { step: '1', text: 'Press Play to start the animation' },
                    { step: '2', text: 'Click 📝 on each step to add your own notes' },
                    { step: '3', text: 'Switch to Deep Dive for a full breakdown' },
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

          {activeTab === 'deepdive' && (
            <DeepDiveSection deepDive={lesson.deepDive} />
          )}

          {activeTab === 'code' && <CodeViewer codeExplanation={lesson.codeExplanation} />}
          {activeTab === 'web'  && <WebResults webResults={webResults} />}
          {activeTab === 'quiz' && (
            <QuizSection quiz={lesson.quiz} topic={topic} onComplete={onQuizComplete} />
          )}

          {activeTab === 'notes' && (
            <NotesTab lesson={lesson} getNote={getNote} setNote={setNote} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Ask AI button */}
      <AskAI topic={topic} lessonContext={lessonContext} />
    </motion.div>
  );
}

function NotesTab({ lesson, getNote, setNote }) {
  const steps = lesson?.animation?.steps || [];
  const notedSteps = steps
    .map((s, i) => ({ step: s, idx: i, note: getNote(`step-${i}`) }))
    .filter(({ note }) => note);

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
        <StickyNote className="w-4 h-4 text-yellow-400" />
        <span className="text-white font-semibold text-sm">My Step Notes</span>
        <span className="ml-auto text-xs text-gray-500">{notedSteps.length} note{notedSteps.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="p-5">
        {notedSteps.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <StickyNote className="w-10 h-10 text-gray-700 mx-auto" />
            <p className="text-gray-500 text-sm">No notes yet.</p>
            <p className="text-gray-600 text-xs">Go to the Animation tab and click "Add a note" on any step.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notedSteps.map(({ step, idx, note }) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-yellow-950/30 border border-yellow-800/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-violet-400 font-mono bg-violet-950/50 px-2 py-0.5 rounded-full">Step {idx + 1}</span>
                  <span className="text-white text-xs font-semibold">{step.title}</span>
                </div>
                <p className="text-yellow-300 text-sm leading-relaxed">{note}</p>
                <button onClick={() => setNote(`step-${idx}`, '')} className="mt-2 text-[10px] text-red-500 hover:text-red-400 transition-colors">Delete note</button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
