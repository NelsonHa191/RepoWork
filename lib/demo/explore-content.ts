// lib/demo/explore-content.ts
// Pre-written Explore answers. Each topic has a main answer and three
// follow-up branches, so clicking suggestions grows the graph the same way the
// Gemini version did.

import { EXPLORE_TOPICS, matchByKeywords } from "./catalog";

export type DemoSource = { id: string; url: string; title: string };

export type ScriptedReply = {
  text: string;
  sources: DemoSource[];
  suggestions: string[];
};

type Answer = { text: string; sources: DemoSource[] };
type Branch = Answer & { prompt: string };
type TopicContent = { root: Answer; branches: [Branch, Branch, Branch] };

const src = (id: string, title: string, url: string): DemoSource => ({ id, title, url });

const CONTENT: Record<string, TopicContent> = {
  "quantum-computing": {
    root: {
      text: `## Quantum computing in a nutshell

A **quantum computer** stores information in **qubits** instead of ordinary bits. A normal bit is always 0 or 1. A qubit can be in a **superposition**: a weighted mix of 0 and 1 that only turns into a definite answer when you measure it.

### The three ideas that make it work
- **Superposition**: a group of qubits can represent many possible states at once.
- **Entanglement**: qubits can be linked so that measuring one tells you something about the others, no matter how far apart they are.
- **Interference**: algorithms are designed so the paths to wrong answers cancel out and the paths to right answers add up.

### What it's *not*
A quantum computer doesn't simply "try every answer in parallel." You only get one measurement at the end, so the trick is choreographing interference so that the right answer is the likely one. That only works for certain kinds of problems.

### Where things stand
Today's machines are **noisy**: qubits lose their quantum state (decoherence) within fractions of a second, and every operation adds a small error. Much of the field's effort goes into **quantum error correction**, which combines many physical qubits into one reliable *logical* qubit.

**In short:** quantum computers aren't faster at everything. They're a different kind of machine that could be dramatically better at a few important problems.`,
      sources: [
        src("qc-1", "Quantum computing - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_computing"),
        src("qc-2", "Qubit - Wikipedia", "https://en.wikipedia.org/wiki/Qubit"),
        src("qc-3", "Quantum decoherence - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_decoherence"),
      ],
    },
    branches: [
      {
        prompt: "How does quantum error correction work?",
        text: `## Quantum error correction

Classical computers fix errors by **copying** bits and taking a majority vote. Quantum computers can't do that directly: the **no-cloning theorem** says you can't copy an unknown quantum state, and simply looking at a qubit destroys its superposition.

### The workaround
- **Spread the information out.** One *logical* qubit is encoded across many *physical* qubits, so no single qubit holds the information on its own.
- **Measure the "symptoms," not the data.** Extra helper qubits measure *parity checks* (called **syndromes**) that reveal whether an error happened and where, without revealing the stored value.
- **Fix and repeat.** The computer applies a correction and repeats the cycle continuously while the program runs.

### The surface code
The most studied approach is the **surface code**, which arranges qubits in a 2D grid. It tolerates relatively high error rates, but it needs a lot of hardware: estimates range from hundreds to thousands of physical qubits per logical qubit.

### Why it matters
Below a certain error rate (the **threshold**), adding more qubits makes the logical qubit *more* reliable instead of less. Crossing that threshold at scale is the key step toward useful, large quantum computers.`,
        sources: [
          src("qec-1", "Quantum error correction - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_error_correction"),
          src("qec-2", "No-cloning theorem - Wikipedia", "https://en.wikipedia.org/wiki/No-cloning_theorem"),
          src("qec-3", "Toric code - Wikipedia", "https://en.wikipedia.org/wiki/Toric_code"),
        ],
      },
      {
        prompt: "What is Shor's algorithm and why does it threaten encryption?",
        text: `## Shor's algorithm

In 1994, mathematician **Peter Shor** showed that a quantum computer could **factor large numbers** exponentially faster than the best known classical methods.

### Why factoring matters
**RSA** encryption, which protects a large share of internet traffic, relies on one assumption: multiplying two huge prime numbers is easy, but splitting the result back into those primes is practically impossible. A similar argument protects **elliptic-curve** cryptography. Shor's algorithm breaks both.

### How it works (roughly)
1. Factoring is turned into a problem of finding the **period** of a repeating function.
2. The quantum computer puts many inputs into superposition at once.
3. A **quantum Fourier transform** uses interference to make the period stand out when measured.
4. A classical computer turns that period into the factors.

### Should we panic?
Not yet. Breaking real RSA keys would take millions of high-quality physical qubits, far beyond today's machines. But encrypted data can be **recorded now and decrypted later**, so the world is already moving to **post-quantum cryptography**. NIST published its first post-quantum standards in 2024.`,
        sources: [
          src("shor-1", "Shor's algorithm - Wikipedia", "https://en.wikipedia.org/wiki/Shor%27s_algorithm"),
          src("shor-2", "Post-quantum cryptography - Wikipedia", "https://en.wikipedia.org/wiki/Post-quantum_cryptography"),
          src("shor-3", "Post-Quantum Cryptography | NIST CSRC", "https://csrc.nist.gov/projects/post-quantum-cryptography"),
        ],
      },
      {
        prompt: "Which problems are quantum computers actually good at?",
        text: `## Where quantum computers could shine

Quantum speedups only exist for problems with the right structure. The most promising areas:

### 🧪 Simulating nature
Molecules and materials obey quantum mechanics, so modeling them on classical computers gets exponentially harder as they grow. A quantum computer can simulate them more directly. That could help with **drug discovery**, **battery chemistry** and **catalysts** (for example, more efficient fertilizer production).

### 🔐 Cryptography
**Shor's algorithm** can break today's public-key encryption, and **Grover's algorithm** gives a smaller (square-root) speedup for brute-force search.

### 📈 Optimization and machine learning
These get a lot of attention, but the evidence is weaker. Many claimed speedups disappear when compared against the best classical algorithms.

### What they're bad at
Everyday tasks like web browsing, spreadsheets, gaming and video. A quantum computer will act as a **co-processor** for specific jobs, not a replacement for your laptop.`,
        sources: [
          src("qa-1", "Quantum simulator - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_simulator"),
          src("qa-2", "Grover's algorithm - Wikipedia", "https://en.wikipedia.org/wiki/Grover%27s_algorithm"),
          src("qa-3", "Quantum computing - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_computing"),
        ],
      },
    ],
  },

  "black-holes": {
    root: {
      text: `## How black holes form

A **black hole** is a region where gravity is so strong that nothing, not even light, can escape. Its boundary is called the **event horizon**.

### 1. The death of a massive star
Most black holes we know of are **stellar-mass** black holes, born when a very massive star (roughly 20+ times the Sun's mass) runs out of fuel:
- Fusion in the core stops, so nothing holds the star up against its own gravity.
- The core **collapses** in a fraction of a second while the outer layers blast away in a **supernova**.
- If the remaining core is heavier than about 2–3 solar masses, not even neutron pressure can stop the collapse, and a black hole forms.

### 2. Growing over time
Black holes grow by swallowing gas and stars (**accretion**) and by **merging** with other black holes. In 2015, LIGO first detected the **gravitational waves** from two black holes merging.

### 3. The giants
Almost every large galaxy has a **supermassive** black hole at its center. Ours, **Sagittarius A***, is about 4 million times the mass of the Sun. In 2019 the **Event Horizon Telescope** released the first image of a black hole's shadow, in the galaxy M87.`,
      sources: [
        src("bh-1", "Black hole - Wikipedia", "https://en.wikipedia.org/wiki/Black_hole"),
        src("bh-2", "Event Horizon Telescope", "https://eventhorizontelescope.org/"),
        src("bh-3", "LIGO Lab | Caltech", "https://www.ligo.caltech.edu/"),
      ],
    },
    branches: [
      {
        prompt: "What happens at the event horizon?",
        text: `## Crossing the event horizon

The **event horizon** isn't a surface you'd bump into. It's a point of no return, where escaping would require moving faster than light.

### If you fell in...
- **For you:** nothing special happens at the moment you cross, especially with a supermassive black hole, where the horizon is huge and the tidal forces there are gentle.
- **For a distant observer:** you'd appear to **slow down** and fade, growing dimmer and redder as you approach the horizon, but never quite seeming to cross it. This is extreme **gravitational time dilation**.

### Spaghettification 🍝
Near a *small* black hole, gravity pulls much harder on your feet than your head. The difference stretches objects into long thin strands, which physicists really do call **spaghettification**.

### What's inside?
General relativity predicts a **singularity**, a point of infinite density, at the center. Most physicists think this means the theory breaks down there, and that a theory of **quantum gravity** is needed to know what really happens.`,
        sources: [
          src("eh-1", "Event horizon - Wikipedia", "https://en.wikipedia.org/wiki/Event_horizon"),
          src("eh-2", "Spaghettification - Wikipedia", "https://en.wikipedia.org/wiki/Spaghettification"),
          src("eh-3", "Gravitational time dilation - Wikipedia", "https://en.wikipedia.org/wiki/Gravitational_time_dilation"),
        ],
      },
      {
        prompt: "How do supermassive black holes get so big?",
        text: `## The supermassive black hole puzzle

Supermassive black holes weigh **millions to billions** of times the Sun's mass. The mystery is *how fast* they got that big: telescopes see huge ones less than a billion years after the Big Bang.

### Ways to grow
- **Accretion:** pulling in gas from the galaxy around them. The infalling gas heats up and can shine brighter than the entire galaxy, as a **quasar**.
- **Mergers:** when galaxies collide, their central black holes eventually spiral together and merge.

### Where did the "seeds" come from?
- **Light seeds:** black holes left behind by the first generation of stars, which then grew extremely fast.
- **Heavy seeds:** huge gas clouds that may have collapsed **directly** into black holes of tens of thousands of solar masses or more, skipping the star stage entirely.

### Our own giant
**Sagittarius A***, at the center of the Milky Way, is about **4 million** solar masses. Astronomers confirmed it by tracking stars racing around an invisible object, work that earned the **2020 Nobel Prize in Physics**.`,
        sources: [
          src("smbh-1", "Supermassive black hole - Wikipedia", "https://en.wikipedia.org/wiki/Supermassive_black_hole"),
          src("smbh-2", "Sagittarius A* - Wikipedia", "https://en.wikipedia.org/wiki/Sagittarius_A*"),
          src("smbh-3", "Quasar - Wikipedia", "https://en.wikipedia.org/wiki/Quasar"),
        ],
      },
      {
        prompt: "Do black holes ever die? (Hawking radiation)",
        text: `## Hawking radiation: how black holes evaporate

In 1974, **Stephen Hawking** combined general relativity with quantum mechanics and found something surprising: black holes aren't completely black. They should give off a faint glow, now called **Hawking radiation**.

### The idea
Quantum effects near the event horizon let a black hole slowly radiate energy away. Losing energy means losing **mass**, so over an enormous amount of time a black hole **shrinks and eventually evaporates**.

### How slow is slow?
- The radiation is weaker for **bigger** black holes.
- A black hole the mass of the Sun would take around **10⁶⁷ years** to evaporate, vastly longer than the current age of the universe (about 1.4 × 10¹⁰ years).
- Today, real black holes absorb more energy from the cosmic background radiation than they emit, so they're still growing.

### The information paradox
If a black hole evaporates into featureless radiation, what happens to the information about everything that fell in? This **black hole information paradox** is still one of the biggest open questions in physics.`,
        sources: [
          src("hr-1", "Hawking radiation - Wikipedia", "https://en.wikipedia.org/wiki/Hawking_radiation"),
          src("hr-2", "Black hole information paradox - Wikipedia", "https://en.wikipedia.org/wiki/Black_hole_information_paradox"),
          src("hr-3", "Black hole - Wikipedia", "https://en.wikipedia.org/wiki/Black_hole"),
        ],
      },
    ],
  },

  react: {
    root: {
      text: `## React best practices

### 🧩 Components
- Keep components **small and focused**. If one is hard to name, it's probably doing too much.
- Keep them **pure**: the same props and state should always render the same output. Side effects belong in event handlers or effects, never in the render itself.
- Give list items **stable keys** (an id from your data, not the array index).

### 📦 State
- **Keep state as close as possible** to where it's used, and lift it up only when siblings need to share it.
- **Don't store what you can calculate.** If a value can be derived from props or other state, compute it during render instead of syncing it with an effect.
- Treat state as **immutable**: create new objects and arrays instead of changing existing ones.

### ⚙️ Effects
Use **useEffect** only to sync with something *outside* React (a network connection, a browser API, a third-party widget). Many effects in real code aren't needed at all.

### 🛠️ Tooling
- Start new apps with a **framework** like Next.js or React Router, or use **Vite** for client-only apps.
- Use **TypeScript** and the official **ESLint rules for hooks** to catch mistakes early.
- Build with **accessible** HTML: real buttons, labels and alt text.`,
      sources: [
        src("re-1", "Quick Start – React", "https://react.dev/learn"),
        src("re-2", "Thinking in React – React", "https://react.dev/learn/thinking-in-react"),
        src("re-3", "Keeping Components Pure – React", "https://react.dev/learn/keeping-components-pure"),
      ],
    },
    branches: [
      {
        prompt: "When should I actually use useEffect?",
        text: `## When to use useEffect (and when not to)

The React docs describe effects as an **escape hatch**: a way to step outside React and sync with an **external system**.

### ✅ Good uses
- Connecting to a **chat server** or **WebSocket** and disconnecting on cleanup.
- Subscribing to **browser APIs**, like window resize or online/offline events.
- Controlling a **non-React widget**, like a map or video player.
- **Fetching data**, with cleanup to ignore stale responses (although a framework or a data library usually handles this better).

### ❌ You probably don't need an effect to...
- **Transform data for rendering.** Filter or sort the list during render instead.
- **Respond to a user action.** Put that logic in the event handler, where you know exactly what happened.
- **Reset state when a prop changes.** Pass a different **key** to the component instead.
- **Keep two pieces of state in sync.** Store one and compute the other.

### Rule of thumb
If the code runs *because the component was displayed*, an effect may be right. If it runs *because the user did something*, it belongs in an event handler.`,
        sources: [
          src("ue-1", "You Might Not Need an Effect – React", "https://react.dev/learn/you-might-not-need-an-effect"),
          src("ue-2", "Synchronizing with Effects – React", "https://react.dev/learn/synchronizing-with-effects"),
          src("ue-3", "useEffect – React", "https://react.dev/reference/react/useEffect"),
        ],
      },
      {
        prompt: "How should I manage state in a larger React app?",
        text: `## Managing state as an app grows

Most "state management" problems get easier once you separate state into **kinds**:

### 1. Local UI state
Things like whether a dropdown is open or what's typed in a form field. **useState** and **useReducer** are perfect for this. Keep it in the component that uses it.

### 2. Shared app state
Things like the current user or theme. **Lift state up** to the closest common parent, and use **Context** when passing props through many layers gets painful. For complex shared state, a small store like **Zustand** or **Redux Toolkit** can help.

### 3. Server state
Data that really lives on a server. It needs caching, refetching and loading/error handling, so use a framework's data loading or a library like **TanStack Query** instead of hand-rolled useEffect fetching.

### 4. URL state
Filters, tabs and search terms often belong in the **URL**, so they survive refreshes and can be shared as links.

### Tips
- Avoid **duplicate** or **contradictory** state, like an isLoading flag *and* a status field.
- Use **useReducer** when several pieces of state change together.`,
        sources: [
          src("st-1", "Managing State – React", "https://react.dev/learn/managing-state"),
          src("st-2", "Choosing the State Structure – React", "https://react.dev/learn/choosing-the-state-structure"),
          src("st-3", "Passing Data Deeply with Context – React", "https://react.dev/learn/passing-data-deeply-with-context"),
        ],
      },
      {
        prompt: "How do I make React apps faster?",
        text: `## Making React apps faster

### 1. Measure first 📏
Use the **React DevTools Profiler** and your browser's performance tools to find what's actually slow. Guessing usually leads to optimizing the wrong thing.

### 2. Avoid unnecessary work
- **Keep state local** so updates only re-render the part of the tree that cares.
- Pass content as **children** so a parent's state change doesn't re-render everything inside it.
- Use **memo**, **useMemo** and **useCallback** for genuinely expensive calculations or components, not everywhere by default.
- The **React Compiler** can add much of this memoization automatically.

### 3. Ship less JavaScript
- **Code-split** with lazy() and Suspense, or rely on your framework's route-based splitting.
- Watch out for heavy dependencies. A single date or chart library can add a lot of weight.

### 4. Big lists and slow inputs
- **Virtualize** long lists so only the visible rows render.
- Use **useTransition** or **useDeferredValue** to keep typing responsive while a slow part of the UI updates.`,
        sources: [
          src("pf-1", "memo – React", "https://react.dev/reference/react/memo"),
          src("pf-2", "React Compiler – React", "https://react.dev/learn/react-compiler"),
          src("pf-3", "useDeferredValue – React", "https://react.dev/reference/react/useDeferredValue"),
        ],
      },
    ],
  },

  internet: {
    root: {
      text: `## How the internet works

The internet is a **network of networks**: millions of independent networks (home Wi-Fi, universities, companies, phone carriers) that agree to pass data to each other using shared rules called **protocols**.

### 📦 Everything travels in packets
Data is broken into small **packets**. Each one carries a destination **IP address**, like an address on an envelope. Packets from the same file can take different routes and get reassembled at the other end.

### 🗺️ Routers find the way
**Routers** forward each packet one hop closer to its destination. Large networks announce which addresses they can reach using a protocol called **BGP**, which is how the whole map stays up to date.

### 🤝 TCP and UDP
- **TCP** makes delivery reliable: it numbers packets, resends lost ones and puts them back in order. It's used for web pages, email and files.
- **UDP** is faster but makes no promises. It's used for video calls and games, where a late packet is useless anyway.

### 📖 DNS: the phone book
People use names like example.com, but computers need IP addresses. **DNS** translates one into the other.

### 🌊 The physical layer
Under it all are copper, fiber-optic cables and radio. Almost all intercontinental traffic travels through **undersea cables**, not satellites.`,
      sources: [
        src("in-1", "Internet protocol suite - Wikipedia", "https://en.wikipedia.org/wiki/Internet_protocol_suite"),
        src("in-2", "Border Gateway Protocol - Wikipedia", "https://en.wikipedia.org/wiki/Border_Gateway_Protocol"),
        src("in-3", "Submarine communications cable - Wikipedia", "https://en.wikipedia.org/wiki/Submarine_communications_cable"),
      ],
    },
    branches: [
      {
        prompt: "What happens when I type a URL into my browser?",
        text: `## From URL to web page

Say you type **https://example.com** and press Enter:

1. **Parse the URL.** The browser reads the scheme (https), the host (example.com) and the path (/).
2. **DNS lookup.** It asks DNS for the site's **IP address**, checking its caches first.
3. **Open a connection.** It sets up a **TCP** connection to that IP on port 443 (newer **HTTP/3** uses QUIC over UDP instead).
4. **TLS handshake.** The browser checks the site's **certificate** and agrees on encryption keys, so everything after this point is private.
5. **Send the request.** For example, "GET /" plus headers like cookies and accepted languages.
6. **Get the response.** The server replies with a status code (**200 OK**, **404 Not Found**...) and the HTML.
7. **Render.** The browser parses the HTML, fetches CSS, JavaScript and images (often in parallel), builds the page layout and paints the pixels.

All of this usually happens in **well under a second**.`,
        sources: [
          src("url-1", "HTTP - Wikipedia", "https://en.wikipedia.org/wiki/HTTP"),
          src("url-2", "What happens in a TLS handshake? | Cloudflare", "https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/"),
          src("url-3", "HTTP/3 - Wikipedia", "https://en.wikipedia.org/wiki/HTTP/3"),
        ],
      },
      {
        prompt: "How does DNS find the right server?",
        text: `## How DNS lookups work

**DNS (the Domain Name System)** turns names like **www.example.com** into IP addresses. It's a giant **distributed, hierarchical** database.

### The lookup chain
1. **Your device's cache.** If you visited recently, the answer may already be stored.
2. **A recursive resolver.** Usually run by your ISP, or a public one like 1.1.1.1 or 8.8.8.8. It does the legwork for you.
3. **A root server.** It doesn't know the answer, but it points to the servers for **.com**.
4. **A TLD server.** The **.com** servers point to the domain's **authoritative** name servers.
5. **The authoritative server.** It returns the actual record, like "www.example.com is at 203.0.113.10."

### Caching keeps it fast
Every answer comes with a **TTL (time to live)**, which says how long it can be cached. That's why DNS changes can take a while to "propagate."

### Common record types
- **A / AAAA**: IPv4 / IPv6 addresses
- **CNAME**: an alias for another name
- **MX**: mail servers for the domain
- **TXT**: free text, often used to verify domain ownership`,
        sources: [
          src("dns-1", "What is DNS? | Cloudflare", "https://www.cloudflare.com/learning/dns/what-is-dns/"),
          src("dns-2", "Domain Name System - Wikipedia", "https://en.wikipedia.org/wiki/Domain_Name_System"),
          src("dns-3", "List of DNS record types - Wikipedia", "https://en.wikipedia.org/wiki/List_of_DNS_record_types"),
        ],
      },
      {
        prompt: "How does HTTPS keep my connection private?",
        text: `## How HTTPS works

**HTTPS** is ordinary HTTP sent through an encrypted **TLS** connection. It gives you three guarantees:

- 🔒 **Privacy**: nobody on the network (your Wi-Fi, your ISP) can read what's sent.
- ✅ **Integrity**: nobody can secretly change the data in transit.
- 🪪 **Authenticity**: you're really talking to the site you asked for.

### The TLS handshake
1. The browser says hello and lists the encryption methods it supports.
2. The server replies with its choice and its **certificate**, which says "this key belongs to example.com" and is signed by a trusted **certificate authority**.
3. The browser checks the signature against the authorities it already trusts.
4. Both sides use a **key exchange** (usually elliptic-curve Diffie–Hellman) to agree on a shared secret **without ever sending it**.
5. From then on, everything is encrypted with fast **symmetric encryption** like AES or ChaCha20.

### What HTTPS doesn't hide
The **domain** you visit is still visible to your network, through DNS lookups and the TLS handshake. And HTTPS doesn't make a site trustworthy, only your connection to it.`,
        sources: [
          src("tls-1", "Transport Layer Security - Wikipedia", "https://en.wikipedia.org/wiki/Transport_Layer_Security"),
          src("tls-2", "What happens in a TLS handshake? | Cloudflare", "https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/"),
          src("tls-3", "Public key certificate - Wikipedia", "https://en.wikipedia.org/wiki/Public_key_certificate"),
        ],
      },
    ],
  },
};

const FALLBACK: ScriptedReply = {
  text: `## 👋 This is the demo version of Repose AI

The original app sent your question to **Gemini 2.0 Flash** with **Google Search grounding**, so it could answer almost anything with up-to-date sources.

To keep this demo free and running without API keys, the answers are **pre-written** for a few topics. Your question didn't match one of them, but you can still see exactly how exploring works:

- Pick a topic below. Each answer comes with **sources** and **follow-up suggestions**.
- Every suggestion you click becomes a new branch in the **graph** on the right.

*Tip: the chips on the home screen show the topics this demo knows about.*`,
  sources: [],
  suggestions: EXPLORE_TOPICS.map((t) => t.prompt),
};

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?.!]+$/, "");
}

/** Chooses the pre-written answer for the latest user message. */
export function pickExploreReply(userText: string): ScriptedReply {
  const text = normalize(userText);
  const topicKeys = EXPLORE_TOPICS.map((t) => t.key);

  // 1. Exact match on a topic prompt or one of its follow-up suggestions
  for (const [i, key] of topicKeys.entries()) {
    const topic = CONTENT[key];
    const next = EXPLORE_TOPICS[(i + 1) % EXPLORE_TOPICS.length];
    if (normalize(EXPLORE_TOPICS[i].prompt) === text) {
      return { ...topic.root, suggestions: topic.branches.map((b) => b.prompt) };
    }
    const branchIndex = topic.branches.findIndex((b) => normalize(b.prompt) === text);
    if (branchIndex !== -1) {
      const branch = topic.branches[branchIndex];
      const siblings = topic.branches.filter((_, j) => j !== branchIndex).map((b) => b.prompt);
      return { text: branch.text, sources: branch.sources, suggestions: [...siblings, next.prompt] };
    }
  }

  // 2. Keyword match on a topic
  const topic = matchByKeywords(userText, EXPLORE_TOPICS);
  if (topic) {
    const content = CONTENT[topic.key];
    return { ...content.root, suggestions: content.branches.map((b) => b.prompt) };
  }

  // 3. Nothing matched: explain the demo and offer the known topics
  return FALLBACK;
}
