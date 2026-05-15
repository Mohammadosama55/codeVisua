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
        "highlight": "which element/node/index is active",
        "state": "current state description"
      }
    ],
    "initialData": [any initial data structure values, e.g. array of numbers or node values]
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
  "quiz": [
    { "question": "question text", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "why this is correct" }
  ]
}

Be thorough, accurate, and make it feel like a premium lesson. All code must be complete and runnable.`;

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
