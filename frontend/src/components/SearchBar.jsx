import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Binary Search Tree', 'Merge Sort', 'Dijkstra Algorithm',
  'Dynamic Programming', 'Hash Table', 'Linked List',
  'Quick Sort', 'BFS & DFS', 'Heap / Priority Queue',
  'Trie', 'Graph Traversal', 'Recursion'
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) onSearch(query.trim());
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    onSearch(s);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{ boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.4)' : '0 0 0 0px rgba(139,92,246,0)' }}
          className="relative flex items-center bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden"
        >
          <Search className="absolute left-5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search any DSA / CS concept..."
            className="w-full bg-transparent text-white placeholder-gray-500 pl-14 pr-4 py-4 text-lg outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="flex items-center gap-2 mr-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Learn</span>
            )}
          </button>
        </motion.div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-400 hover:bg-violet-900 hover:text-violet-300 border border-gray-700 hover:border-violet-600 transition-all disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
