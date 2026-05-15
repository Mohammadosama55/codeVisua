import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const LANGS = [
  { id: 'python', label: 'Python', icon: '🐍', color: 'from-blue-600 to-blue-400' },
  { id: 'cpp', label: 'C++', icon: '⚡', color: 'from-cyan-600 to-cyan-400' },
  { id: 'java', label: 'Java', icon: '☕', color: 'from-orange-600 to-orange-400' },
];

function LineExplanation({ lineByLine }) {
  const [open, setOpen] = useState(false);
  if (!lineByLine?.length) return null;
  return (
    <div className="border-t border-gray-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>📖</span> Line-by-line explanation
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2">
              {lineByLine.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 font-mono text-violet-400 text-xs bg-violet-950 px-2 py-0.5 rounded border border-violet-800 h-fit mt-0.5">
                    L{item.lines}
                  </span>
                  <span className="text-gray-300 leading-relaxed">{item.explanation}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CodeViewer({ codeExplanation }) {
  const [activeLang, setActiveLang] = useState('python');
  const [copied, setCopied] = useState(false);

  const langData = codeExplanation?.[activeLang] || {};
  const code = langData.code || '// No code available';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const prismLang = activeLang === 'cpp' ? 'cpp' : activeLang === 'java' ? 'java' : 'python';

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950">
        <div className="flex gap-1">
          {LANGS.map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeLang === lang.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{lang.icon}</span> {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLang}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
        >
          <SyntaxHighlighter
            language={prismLang}
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderRadius: 0, background: '#0d1117', fontSize: '0.85rem', maxHeight: '400px' }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </motion.div>
      </AnimatePresence>

      <LineExplanation lineByLine={langData.lineByLine} />
    </div>
  );
}
