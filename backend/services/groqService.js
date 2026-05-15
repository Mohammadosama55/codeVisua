import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert computer science educator specializing in Data Structures & Algorithms (DSA) and Computer Science fundamentals (CSA). 
Your job is to create comprehensive, YouTube-style educational lessons.

When explaining a concept, structure your response as valid JSON with this exact format:
{
  "title": "Concept title",
  "tagline": "One-line hook/description",
  "difficulty": "Beginner|Intermediate|Advanced",
  "timeToLearn": "estimated minutes",
  "overview": "2-3 sentence overview of the concept",
  "animation": {
    "type": "array|tree|graph|sorting|hash|linked-list|stack|queue|heap|dp-table|custom",
    "steps": [
      {
        "stepId": 1,
        "title": "Step title",
        "description": "What is happening in this step (explain visually)",
        "highlight": "which element/node/index is active (use the value or index)",
        "state": "current state description e.g. 'Comparing index 2 and 3'",
        "data": [the CURRENT snapshot of the data structure at this step, e.g. partially sorted array or current tree nodes]
      }
    ],
    "initialData": [the starting data structure values before any steps]
  },
  "concept": {
    "keyIdeas": ["idea1", "idea2", "idea3"],
    "timeComplexity": { "best": "O(?)", "average": "O(?)", "worst": "O(?)" },
    "spaceComplexity": "O(?)",
    "useCases": ["use case 1", "use case 2"]
  },
  "codeExplanation": {
    "python": {
      "code": "full working Python code",
      "lineByLine": [
        { "lines": "1-2", "explanation": "what these lines do" }
      ]
    },
    "cpp": {
      "code": "full working C++ code",
      "lineByLine": [
        { "lines": "1-2", "explanation": "what these lines do" }
      ]
    },
    "java": {
      "code": "full working Java code",
      "lineByLine": [
        { "lines": "1-2", "explanation": "what these lines do" }
      ]
    }
  },
  "deepDive": {
    "hook": "1-2 sentence attention-grabbing opener like a YouTuber would say (e.g. 'Ever wondered how Google Maps finds the shortest path in milliseconds?')",
    "definition": "Crystal-clear, beginner-friendly definition in 2-3 sentences. No jargon.",
    "analogy": "A vivid real-world analogy that makes the concept click instantly (e.g. comparing a stack to a stack of plates)",
    "example": "Walk through ONE concrete example step by step with specific values — show inputs, process, and output. Make it feel like a tutor working through it on a whiteboard.",
    "logicSteps": [
      "Step 1: describe exactly what the algorithm does at this point",
      "Step 2: next logical step with explanation of WHY",
      "Step 3: continue until the concept is fully explained"
    ],
    "internalExecution": [
      "Line 1-2: describe what these lines do in memory/execution",
      "Line 3-4: what variables are created, what values they hold",
      "Function call: what goes on the call stack",
      "Return: what gets returned and why"
    ],
    "commonMistakes": [
      "Mistake 1 and how to avoid it",
      "Mistake 2 beginners often make",
      "Mistake 3 edge case often forgotten"
    ]
  },
  "quiz": [
    { "question": "question text", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "why this is correct" }
  ]
}

Be thorough, accurate, and make it feel like a premium lesson. All code must be complete and runnable. The deepDive section must feel like an engaging YouTube tutorial — conversational, example-driven, and crystal clear.`;

export async function generateLesson(topic) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Create a complete lesson for: "${topic}". Return ONLY valid JSON, no markdown, no extra text.` }
    ],
    temperature: 0.7,
    max_tokens: 8000,
  });

  const raw = completion.choices[0].message.content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse lesson JSON from LLM');

  // Escape literal control characters that appear inside JSON string values.
  // The LLM often puts real newlines/tabs inside "code" strings, making JSON.parse throw.
  const sanitized = jsonMatch[0].replace(
    /"((?:[^"\\]|\\[\s\S])*)"/g,
    (_, inner) =>
      '"' +
      inner
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') +
      '"'
  );

  try {
    return JSON.parse(sanitized);
  } catch (e) {
    // Last-resort: strip every bare control character and retry
    const stripped = sanitized.replace(/[\x00-\x1F\x7F]/g, m =>
      m === '\n' || m === '\r' || m === '\t' ? m : ''
    );
    return JSON.parse(stripped);
  }
}

export async function generateHint(topic, question) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'You are a helpful CS tutor. Give concise, clear hints without giving away the full answer.' },
      { role: 'user', content: `Topic: ${topic}\nQuestion: ${question}\nProvide a helpful hint in 2-3 sentences.` }
    ],
    temperature: 0.5,
    max_tokens: 200,
  });
  return completion.choices[0].message.content.trim();
}

export async function askQuestion(topic, question, history = [], context = '') {
  const systemPrompt = `You are an expert CS tutor specializing in Data Structures & Algorithms. 
The student is currently learning about: "${topic}".
${context ? `Lesson context: ${context}` : ''}

Your style:
- Explain like a great YouTuber: engaging, clear, example-driven
- Use analogies and concrete examples
- Keep answers focused and concise (3-6 sentences unless a longer explanation is genuinely needed)
- If the student is confused, try a completely different angle or analogy
- Use numbered steps when explaining a process
- Always tie back to the current topic: ${topic}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: question },
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: 600,
  });
  return completion.choices[0].message.content.trim();
}
