// lib/demo/catalog.ts
// The list of topics and courses the demo has pre-written answers for.
// This file is small on purpose: the browser uses it for the suggested-prompt
// chips and the lesson videos, while the full answers live in content.ts and
// stay on the server.

export type DemoMode = "explore" | "learn";

export type DemoVideo = {
  id: string; // YouTube video id (checked to exist; embedding needs no API key)
  title: string;
  channel: string;
};

export type ExploreTopic = {
  key: string;
  prompt: string;
  keywords: string[];
};

export type LearnCourse = {
  key: string;
  prompt: string;
  keywords: string[];
  videos: DemoVideo[]; // one per lesson
};

export const EXPLORE_TOPICS: ExploreTopic[] = [
  {
    key: "quantum-computing",
    prompt: "Explain quantum computing",
    keywords: ["quantum comput", "qubit", "quantum computer", "superposition", "entanglement", "shor"],
  },
  {
    key: "black-holes",
    prompt: "How do black holes form?",
    keywords: ["black hole", "event horizon", "hawking", "supernova", "neutron star", "singularity"],
  },
  {
    key: "react",
    prompt: "Best practices for React development",
    keywords: ["react", "jsx", "useeffect", "usestate", "hook", "component", "next.js"],
  },
  {
    key: "internet",
    prompt: "How does the internet work?",
    keywords: ["internet", "dns", "tcp", "packet", "router", "http", "ip address", "wifi", "url"],
  },
];

export const LEARN_COURSES: LearnCourse[] = [
  {
    key: "python",
    prompt: "Learn how to code in Python",
    keywords: ["python", "coding", "code", "programming", "programmer"],
    videos: [
      { id: "x7X9w_GIm1s", title: "Python in 100 Seconds", channel: "Fireship" },
      { id: "kqtD5dpn9C8", title: "Python for Beginners - Learn Coding with Python in 1 Hour", channel: "Programming with Mosh" },
      { id: "rfscVS0vtbw", title: "Learn Python - Full Course for Beginners", channel: "freeCodeCamp.org" },
      { id: "_uQrJ0TkZlc", title: "Python Full Course for Beginners", channel: "Programming with Mosh" },
    ],
  },
  {
    key: "quantum-physics",
    prompt: "Teach me about quantum physics",
    keywords: ["quantum", "physics", "particle", "photon", "wave", "atom", "schrodinger", "schrödinger"],
    videos: [
      { id: "ARWBdfWpDyc", title: "Quantum Physics for 7 Year Olds", channel: "TEDx Talks" },
      { id: "Iuv6hY6zsd0", title: "The Original Double Slit Experiment", channel: "Veritasium" },
      { id: "ARWBdfWpDyc", title: "Quantum Physics for 7 Year Olds", channel: "TEDx Talks" },
      { id: "JhHMJCUmq28", title: "Quantum Computers Explained – Limits of Human Technology", channel: "Kurzgesagt – In a Nutshell" },
    ],
  },
  {
    key: "machine-learning",
    prompt: "Help me understand machine learning",
    keywords: ["machine learning", "neural", "deep learning", "ai", "model", "training", "ml"],
    videos: [
      { id: "ukzFI9rgwfU", title: "What Is Machine Learning? | Introduction To Machine Learning", channel: "Simplilearn" },
      { id: "aircAruvnKk", title: "But what is a neural network? | Deep learning chapter 1", channel: "3Blue1Brown" },
      { id: "IHZwWFHWa-w", title: "Gradient descent, how neural networks learn | Deep Learning Chapter 2", channel: "3Blue1Brown" },
      { id: "Ilg3gGewQ5U", title: "Backpropagation, intuitively | Deep Learning Chapter 3", channel: "3Blue1Brown" },
    ],
  },
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Short keywords ("ai", "ml") must match a whole word, longer ones may be a
// prefix ("quantum comput" matches "computing" and "computers").
function keywordPattern(keyword: string) {
  const body = escapeRegExp(keyword.toLowerCase());
  return new RegExp(keyword.length <= 3 ? `\\b${body}\\b` : `\\b${body}`, "i");
}

/** Picks the item whose keywords appear most often in the text. */
export function matchByKeywords<T extends { keywords: string[] }>(
  text: string,
  items: T[]
): T | undefined {
  let best: T | undefined;
  let bestScore = 0;
  for (const item of items) {
    const score = item.keywords.filter((k) => keywordPattern(k).test(text)).length;
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

export function findCourse(topic: string) {
  return matchByKeywords(topic, LEARN_COURSES);
}

export function demoPrompts(mode: DemoMode) {
  return (mode === "explore" ? EXPLORE_TOPICS : LEARN_COURSES).map((t) => t.prompt);
}
