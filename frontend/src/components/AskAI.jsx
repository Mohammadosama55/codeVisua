import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Sparkles, RotateCcw } from 'lucide-react';

const STARTERS = [
  'Can you give me a simpler analogy?',
  'What are the common mistakes beginners make?',
  'How does this compare to a similar algorithm?',
  'Walk me through a real-world example.',
  'What happens in memory when this runs?',
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isUser ? 'bg-violet-700' : 'bg-gray-800 border border-gray-700'}`}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-violet-400" />}
      </div>
      <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-violet-700 text-white rounded-tr-sm'
          : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-sm'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-violet-400" />
      </div>
      <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
          />
        ))}
      </div>
    </div>
  );
}

export default function AskAI({ topic, lessonContext }) {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/api/learn/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          question: q,
          history: messages.slice(-6),
          context: lessonContext,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'Sorry, I could not answer that.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white font-semibold shadow-2xl shadow-violet-900/60"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">Ask AI</span>
        {messages.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-white text-violet-700 text-[10px] font-bold flex items-center justify-center">
            {messages.filter(m => m.role === 'assistant').length}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{   opacity: 0, x: 60,  scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[400px] h-[560px] flex flex-col bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Ask AI Tutor</p>
                    <p className="text-gray-500 text-[10px]">Topic: {topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button onClick={() => setMessages([])} className="p-1.5 text-gray-600 hover:text-gray-400 rounded-lg hover:bg-gray-800 transition-colors" title="Clear chat">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="p-1.5 text-gray-600 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="text-center pt-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-700 to-blue-700 flex items-center justify-center mx-auto mb-3">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white font-semibold text-sm">Hi! I'm your AI tutor 👋</p>
                      <p className="text-gray-500 text-xs mt-1">Ask me anything about <span className="text-violet-400 font-semibold">{topic}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wide font-semibold mb-2 text-center">Try asking</p>
                      <div className="space-y-2">
                        {STARTERS.map(s => (
                          <button key={s} onClick={() => send(s)}
                            className="w-full text-left text-xs px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:border-violet-700 hover:text-violet-300 hover:bg-violet-950/30 transition-all">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {messages.map((m, i) => <Message key={i} msg={m} />)}
                {loading && <TypingDots />}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-3 pb-3 pt-2 border-t border-gray-800 shrink-0">
                <div className="flex items-end gap-2 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 focus-within:border-violet-600 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
                    placeholder="Ask about this concept…"
                    rows={1}
                    className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-gray-600 max-h-28"
                    style={{ fieldSizing: 'content' }}
                  />
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-gray-700 text-[9px] text-center mt-1.5">Shift+Enter for new line</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
