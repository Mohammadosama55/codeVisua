export const TRACKS = [
  {
    id: 'foundations',
    label: 'Foundations',
    color: 'from-blue-600 to-blue-400',
    borderColor: 'border-blue-600',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    icon: '🏗️',
    topics: [
      { id: 'arrays', title: 'Arrays', difficulty: 'Beginner', prereqs: [], icon: '📊' },
      { id: 'strings', title: 'Strings', difficulty: 'Beginner', prereqs: [], icon: '🔤' },
      { id: 'time-complexity', title: 'Big O Notation', difficulty: 'Beginner', prereqs: [], icon: '⏱️' },
      { id: 'recursion', title: 'Recursion', difficulty: 'Beginner', prereqs: ['arrays'], icon: '🔄' },
      { id: 'two-pointers', title: 'Two Pointers', difficulty: 'Beginner', prereqs: ['arrays'], icon: '👆' },
      { id: 'sliding-window', title: 'Sliding Window', difficulty: 'Intermediate', prereqs: ['arrays', 'two-pointers'], icon: '🪟' },
    ],
  },
  {
    id: 'linear',
    label: 'Linear Structures',
    color: 'from-violet-600 to-violet-400',
    borderColor: 'border-violet-600',
    textColor: 'text-violet-400',
    bgColor: 'bg-violet-950/40',
    icon: '🔗',
    topics: [
      { id: 'linked-list', title: 'Linked List', difficulty: 'Beginner', prereqs: ['arrays'], icon: '🔗' },
      { id: 'doubly-linked-list', title: 'Doubly Linked List', difficulty: 'Beginner', prereqs: ['linked-list'], icon: '↔️' },
      { id: 'stack', title: 'Stack', difficulty: 'Beginner', prereqs: ['arrays'], icon: '📚' },
      { id: 'queue', title: 'Queue', difficulty: 'Beginner', prereqs: ['arrays', 'linked-list'], icon: '🚶' },
      { id: 'deque', title: 'Deque', difficulty: 'Intermediate', prereqs: ['queue', 'stack'], icon: '↔️' },
      { id: 'circular-queue', title: 'Circular Queue', difficulty: 'Intermediate', prereqs: ['queue'], icon: '🔁' },
    ],
  },
  {
    id: 'hashing',
    label: 'Hashing & Search',
    color: 'from-cyan-600 to-cyan-400',
    borderColor: 'border-cyan-600',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    icon: '🗂️',
    topics: [
      { id: 'hash-table', title: 'Hash Table', difficulty: 'Beginner', prereqs: ['arrays'], icon: '🗂️' },
      { id: 'hash-map', title: 'Hash Map / Dictionary', difficulty: 'Beginner', prereqs: ['hash-table'], icon: '🗃️' },
      { id: 'binary-search', title: 'Binary Search', difficulty: 'Beginner', prereqs: ['arrays', 'time-complexity'], icon: '🔍' },
      { id: 'trie', title: 'Trie', difficulty: 'Intermediate', prereqs: ['hash-table', 'strings'], icon: '🌿' },
      { id: 'bloom-filter', title: 'Bloom Filter', difficulty: 'Advanced', prereqs: ['hash-table'], icon: '🌸' },
    ],
  },
  {
    id: 'sorting',
    label: 'Sorting Algorithms',
    color: 'from-pink-600 to-pink-400',
    borderColor: 'border-pink-600',
    textColor: 'text-pink-400',
    bgColor: 'bg-pink-950/40',
    icon: '📶',
    topics: [
      { id: 'bubble-sort', title: 'Bubble Sort', difficulty: 'Beginner', prereqs: ['arrays', 'time-complexity'], icon: '🫧' },
      { id: 'selection-sort', title: 'Selection Sort', difficulty: 'Beginner', prereqs: ['arrays'], icon: '✅' },
      { id: 'insertion-sort', title: 'Insertion Sort', difficulty: 'Beginner', prereqs: ['arrays'], icon: '📌' },
      { id: 'merge-sort', title: 'Merge Sort', difficulty: 'Intermediate', prereqs: ['recursion', 'time-complexity'], icon: '🔀' },
      { id: 'quick-sort', title: 'Quick Sort', difficulty: 'Intermediate', prereqs: ['recursion', 'two-pointers'], icon: '⚡' },
      { id: 'heap-sort', title: 'Heap Sort', difficulty: 'Intermediate', prereqs: ['merge-sort'], icon: '⛰️' },
      { id: 'counting-sort', title: 'Counting Sort', difficulty: 'Intermediate', prereqs: ['arrays', 'hash-table'], icon: '🔢' },
      { id: 'radix-sort', title: 'Radix Sort', difficulty: 'Advanced', prereqs: ['counting-sort'], icon: '📡' },
    ],
  },
  {
    id: 'trees',
    label: 'Trees',
    color: 'from-green-600 to-green-400',
    borderColor: 'border-green-600',
    textColor: 'text-green-400',
    bgColor: 'bg-green-950/40',
    icon: '🌲',
    topics: [
      { id: 'binary-tree', title: 'Binary Tree', difficulty: 'Beginner', prereqs: ['linked-list', 'recursion'], icon: '🌱' },
      { id: 'binary-search-tree', title: 'Binary Search Tree', difficulty: 'Intermediate', prereqs: ['binary-tree', 'binary-search'], icon: '🌲' },
      { id: 'avl-tree', title: 'AVL Tree', difficulty: 'Advanced', prereqs: ['binary-search-tree'], icon: '⚖️' },
      { id: 'red-black-tree', title: 'Red-Black Tree', difficulty: 'Advanced', prereqs: ['binary-search-tree'], icon: '🔴' },
      { id: 'heap', title: 'Heap / Priority Queue', difficulty: 'Intermediate', prereqs: ['binary-tree', 'arrays'], icon: '⛰️' },
      { id: 'segment-tree', title: 'Segment Tree', difficulty: 'Advanced', prereqs: ['binary-tree', 'recursion'], icon: '📐' },
      { id: 'fenwick-tree', title: 'Fenwick Tree (BIT)', difficulty: 'Advanced', prereqs: ['segment-tree'], icon: '🌳' },
      { id: 'n-ary-tree', title: 'N-ary Tree', difficulty: 'Intermediate', prereqs: ['binary-tree'], icon: '🎄' },
    ],
  },
  {
    id: 'graphs',
    label: 'Graphs',
    color: 'from-orange-600 to-orange-400',
    borderColor: 'border-orange-600',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-950/40',
    icon: '🕸️',
    topics: [
      { id: 'graph-basics', title: 'Graph Representation', difficulty: 'Intermediate', prereqs: ['arrays', 'hash-table'], icon: '🗺️' },
      { id: 'bfs', title: 'BFS (Breadth-First Search)', difficulty: 'Intermediate', prereqs: ['graph-basics', 'queue'], icon: '🌊' },
      { id: 'dfs', title: 'DFS (Depth-First Search)', difficulty: 'Intermediate', prereqs: ['graph-basics', 'stack', 'recursion'], icon: '🔦' },
      { id: 'topological-sort', title: 'Topological Sort', difficulty: 'Intermediate', prereqs: ['dfs', 'bfs'], icon: '📋' },
      { id: 'dijkstra', title: "Dijkstra's Algorithm", difficulty: 'Advanced', prereqs: ['heap', 'bfs'], icon: '🛣️' },
      { id: 'bellman-ford', title: 'Bellman-Ford', difficulty: 'Advanced', prereqs: ['graph-basics', 'dijkstra'], icon: '🚧' },
      { id: 'floyd-warshall', title: 'Floyd-Warshall', difficulty: 'Advanced', prereqs: ['bellman-ford'], icon: '🌐' },
      { id: 'union-find', title: 'Union Find (DSU)', difficulty: 'Intermediate', prereqs: ['graph-basics'], icon: '🤝' },
      { id: 'minimum-spanning-tree', title: "Kruskal's / Prim's MST", difficulty: 'Advanced', prereqs: ['union-find', 'heap'], icon: '🏕️' },
    ],
  },
  {
    id: 'dp',
    label: 'Dynamic Programming',
    color: 'from-yellow-600 to-yellow-400',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-950/40',
    icon: '🧮',
    topics: [
      { id: 'memoization', title: 'Memoization', difficulty: 'Intermediate', prereqs: ['recursion', 'hash-map'], icon: '🧠' },
      { id: 'dynamic-programming', title: 'DP Fundamentals', difficulty: 'Intermediate', prereqs: ['memoization', 'recursion'], icon: '🧮' },
      { id: 'knapsack', title: '0/1 Knapsack', difficulty: 'Intermediate', prereqs: ['dynamic-programming'], icon: '🎒' },
      { id: 'longest-common-subsequence', title: 'Longest Common Subsequence', difficulty: 'Intermediate', prereqs: ['dynamic-programming', 'strings'], icon: '🧬' },
      { id: 'coin-change', title: 'Coin Change', difficulty: 'Intermediate', prereqs: ['dynamic-programming'], icon: '🪙' },
      { id: 'longest-increasing-subsequence', title: 'Longest Increasing Subsequence', difficulty: 'Advanced', prereqs: ['dynamic-programming', 'binary-search'], icon: '📈' },
      { id: 'matrix-dp', title: 'Matrix Chain / Grid DP', difficulty: 'Advanced', prereqs: ['dynamic-programming', 'knapsack'], icon: '🔲' },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced Algorithms',
    color: 'from-red-600 to-red-400',
    borderColor: 'border-red-600',
    textColor: 'text-red-400',
    bgColor: 'bg-red-950/40',
    icon: '🚀',
    topics: [
      { id: 'divide-and-conquer', title: 'Divide & Conquer', difficulty: 'Intermediate', prereqs: ['merge-sort', 'recursion'], icon: '✂️' },
      { id: 'greedy', title: 'Greedy Algorithms', difficulty: 'Intermediate', prereqs: ['sorting-fundamentals', 'heap'], icon: '🤑' },
      { id: 'backtracking', title: 'Backtracking', difficulty: 'Intermediate', prereqs: ['recursion', 'dfs'], icon: '↩️' },
      { id: 'bit-manipulation', title: 'Bit Manipulation', difficulty: 'Intermediate', prereqs: ['time-complexity'], icon: '🔢' },
      { id: 'kmp-algorithm', title: 'KMP String Search', difficulty: 'Advanced', prereqs: ['strings', 'dynamic-programming'], icon: '🔎' },
      { id: 'two-sum-variations', title: 'Two Sum Patterns', difficulty: 'Intermediate', prereqs: ['hash-map', 'two-pointers'], icon: '➕' },
    ],
  },
];

export const ALL_TOPICS = TRACKS.flatMap(t => t.topics.map(tp => ({ ...tp, track: t.id })));

export const TOPIC_MAP = Object.fromEntries(ALL_TOPICS.map(t => [t.id, t]));

export function getTopicStatus(topicId, completedIds) {
  const topic = TOPIC_MAP[topicId];
  if (!topic) return 'available';
  if (completedIds.has(topicId)) return 'completed';
  const prereqsMet = topic.prereqs.every(p => completedIds.has(p));
  return prereqsMet ? 'available' : 'locked';
}

export function getNextSuggestions(completedIds, limit = 4) {
  return ALL_TOPICS
    .filter(t => {
      if (completedIds.has(t.id)) return false;
      return t.prereqs.every(p => completedIds.has(p));
    })
    .sort((a, b) => {
      const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    })
    .slice(0, limit);
}

export function matchHistoryToTopics(history) {
  const completed = new Set();
  history.forEach(entry => {
    const searchTerm = (entry.topic || entry.title || '').toLowerCase().replace(/[^a-z0-9 ]/g, '');
    ALL_TOPICS.forEach(t => {
      const titleMatch = t.title.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const idMatch = t.id.replace(/-/g, ' ');
      if (
        searchTerm.includes(titleMatch) ||
        titleMatch.includes(searchTerm) ||
        searchTerm.includes(idMatch) ||
        searchTerm.replace(/ /g, '-') === t.id
      ) {
        completed.add(t.id);
      }
    });
  });
  return completed;
}
