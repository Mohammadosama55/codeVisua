import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, Trophy } from 'lucide-react';

export default function QuizSection({ quiz, topic, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [done, setDone] = useState(false);

  if (!quiz?.length) return null;

  const handleAnswer = (qi, oi) => {
    if (revealed[qi]) return;
    setAnswers(a => ({ ...a, [qi]: oi }));
    setRevealed(r => ({ ...r, [qi]: true }));
  };

  const score = quiz.filter((q, i) => answers[i] === q.correct).length;

  const handleFinish = () => {
    setDone(true);
    if (onComplete) onComplete(score, quiz.length);
  };

  const handleRetry = () => {
    setAnswers({});
    setRevealed({});
    setDone(false);
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-yellow-400" />
        <span className="text-white font-semibold text-sm">Knowledge Check</span>
        <span className="ml-auto text-xs text-gray-500">{quiz.length} questions</span>
      </div>

      <div className="p-5 space-y-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <Trophy className={`w-12 h-12 mx-auto mb-3 ${score === quiz.length ? 'text-yellow-400' : score >= quiz.length / 2 ? 'text-violet-400' : 'text-gray-400'}`} />
              <h3 className="text-2xl font-bold text-white mb-1">{score}/{quiz.length}</h3>
              <p className="text-gray-400 mb-4">
                {score === quiz.length ? '🎉 Perfect score!' : score >= quiz.length / 2 ? '👍 Good job!' : '📚 Keep practicing!'}
              </p>
              <button onClick={handleRetry}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors">
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div key="quiz" className="space-y-6">
              {quiz.map((q, qi) => (
                <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.1 }}>
                  <p className="text-white text-sm font-medium mb-3">
                    <span className="text-violet-400 mr-2">Q{qi + 1}.</span>{q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = answers[qi] === oi;
                      const isCorrect  = oi === q.correct;
                      const isRevealedQ = revealed[qi];
                      let cls = 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600';
                      if (isRevealedQ && isCorrect)              cls = 'bg-green-950 border-green-700 text-green-300';
                      else if (isRevealedQ && isSelected && !isCorrect) cls = 'bg-red-950 border-red-700 text-red-300';
                      return (
                        <button
                          key={oi}
                          onClick={() => handleAnswer(qi, oi)}
                          disabled={isRevealedQ}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left text-sm transition-all ${cls} disabled:cursor-default`}
                        >
                          {isRevealedQ && isCorrect              && <CheckCircle className="w-4 h-4 shrink-0" />}
                          {isRevealedQ && isSelected && !isCorrect && <XCircle    className="w-4 h-4 shrink-0" />}
                          {(!isRevealedQ || (!isCorrect && !isSelected)) && (
                            <span className="w-5 h-5 shrink-0 rounded-full border border-current flex items-center justify-center text-xs">
                              {String.fromCharCode(65 + oi)}
                            </span>
                          )}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {revealed[qi] && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-gray-400 mt-2 pl-2 border-l-2 border-violet-700">
                        {q.explanation}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              {Object.keys(revealed).length === quiz.length && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={handleFinish}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors"
                >
                  See Results
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
