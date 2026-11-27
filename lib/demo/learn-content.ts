// lib/demo/learn-content.ts
// Pre-written Learn courses. Each course has four lessons; "Continue Learning"
// moves to the next one, just like the Gemini version generated the next
// lesson from the topics covered so far.

import { LEARN_COURSES, findCourse } from "./catalog";
import type { DemoSource } from "./explore-content";

export type CodeExample = { language: string; code: string; output: string };

type Lesson = {
  body: string;
  sources: DemoSource[];
  example?: CodeExample;
};

const F = "```";
const src = (id: string, title: string, url: string): DemoSource => ({ id, title, url });

const COURSES: Record<string, Lesson[]> = {
  python: [
    {
      body: `## 🐍 Variables and print()

### 🔑 Key Concept
A **variable** is a name that points to a value. Python works out the **type** for you: whole numbers are **int**, decimals are **float** and text is a **str** (string).

- Create a variable with **=**, for example: name = "Ada"
- **print()** shows values on the screen
- An **f-string** (a string starting with f) lets you drop variables straight into text using {curly braces}

### 💡 Why it matters
Almost every program stores information and shows results. Variables and print() are the first two tools you'll use constantly.

### 🏋️ Practice Exercise
Create variables for your **favorite food** and **how many times a week** you eat it, then print a sentence using an f-string.

**Question:** what do you think happens if you try to add a number to a string, like 5 + "5"?`,
      sources: [
        src("py1-1", "An Informal Introduction to Python", "https://docs.python.org/3/tutorial/introduction.html"),
        src("py1-2", "Built-in Types — Python docs", "https://docs.python.org/3/library/stdtypes.html"),
      ],
      example: {
        language: "python",
        code: `name = "Ada"
age = 36
height_m = 1.65

print("Hello,", name)
print(f"{name} is {age} years old and {height_m} m tall.")
print(type(age), type(height_m), type(name))`,
        output: `Hello, Ada
Ada is 36 years old and 1.65 m tall.
<class 'int'> <class 'float'> <class 'str'>`,
      },
    },
    {
      body: `## 🔁 Lists and loops

### 🔑 Key Concept
A **list** holds several values in order, inside square brackets. A **for loop** runs the same code once for each item.

- **Indexes start at 0**: fruits[0] is the first item, and fruits[-1] is the last
- **.append()** adds an item to the end
- **len()** tells you how many items there are
- **Indentation** (4 spaces) shows which lines belong inside the loop

### 💡 Why it matters
Real programs work with *collections*: users, messages, scores. Loops let you handle a hundred items as easily as one.

### 🏋️ Practice Exercise
Make a list of **five numbers**, loop over it, and print each number doubled.

**Question:** how could you print only the items at even positions?`,
      sources: [
        src("py2-1", "Lists — Python tutorial", "https://docs.python.org/3/tutorial/introduction.html#lists"),
        src("py2-2", "for Statements — Python tutorial", "https://docs.python.org/3/tutorial/controlflow.html#for-statements"),
      ],
      example: {
        language: "python",
        code: `fruits = ["apple", "banana", "kiwi"]
fruits.append("mango")

for fruit in fruits:
    print(f"I like {fruit}s")

print("Count:", len(fruits))
print("First:", fruits[0], "| Last:", fruits[-1])`,
        output: `I like apples
I like bananas
I like kiwis
I like mangos
Count: 4
First: apple | Last: mango`,
      },
    },
    {
      body: `## 🧰 Functions

### 🔑 Key Concept
A **function** is a named, reusable block of code. You define it once with **def** and call it whenever you need it.

- **Parameters** are the inputs (width, height)
- **return** sends a result back to whoever called the function
- **Default values** (height=1) make a parameter optional
- A **docstring** (the text in triple quotes) explains what the function does

### 💡 Why it matters
Functions let you break a big problem into small, named pieces that are easy to test and reuse. They're the building blocks of every larger program.

### 🏋️ Practice Exercise
Write a function **celsius_to_fahrenheit(c)** that returns c * 9 / 5 + 32, then print the result for 0, 37 and 100.

**Question:** what's the difference between a function that *prints* a value and one that *returns* it?`,
      sources: [
        src("py3-1", "Defining Functions — Python tutorial", "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"),
        src("py3-2", "Default Argument Values — Python tutorial", "https://docs.python.org/3/tutorial/controlflow.html#default-argument-values"),
      ],
      example: {
        language: "python",
        code: `def area(width, height=1):
    """Return the area of a rectangle."""
    return width * height

def describe(shape, w, h):
    return f"A {w} x {h} {shape} has an area of {area(w, h)}"

print(area(4, 5))
print(area(7))
print(describe("rug", 2, 3))`,
        output: `20
7
A 2 x 3 rug has an area of 6`,
      },
    },
    {
      body: `## 📚 Dictionaries

### 🔑 Key Concept
A **dictionary** stores **key → value** pairs, like a real dictionary maps words to definitions. You look things up by key instead of by position.

- Create one with curly braces: {"Ana": 91}
- Add or update a value with **scores["Dev"] = 88**
- **.items()** gives you each key and value together in a loop
- **max(scores, key=scores.get)** finds the key with the biggest value

### 💡 Why it matters
Dictionaries are everywhere: settings, JSON from web APIs, counting words, caching results. Together with lists, loops and functions, you now have the core toolkit of Python.

### 🏋️ Practice Exercise
Count how many times each letter appears in the word **"banana"** using a dictionary.

**Question:** when would you choose a dictionary over a list?`,
      sources: [
        src("py4-1", "Dictionaries — Python tutorial", "https://docs.python.org/3/tutorial/datastructures.html#dictionaries"),
        src("py4-2", "Looping Techniques — Python tutorial", "https://docs.python.org/3/tutorial/datastructures.html#looping-techniques"),
      ],
      example: {
        language: "python",
        code: `scores = {"Ana": 91, "Ben": 78, "Cleo": 85}
scores["Dev"] = 88

for name, score in scores.items():
    grade = "A" if score >= 90 else "B" if score >= 80 else "C"
    print(f"{name}: {score} ({grade})")

best = max(scores, key=scores.get)
print("Top student:", best)
print("Average:", sum(scores.values()) / len(scores))`,
        output: `Ana: 91 (A)
Ben: 78 (C)
Cleo: 85 (B)
Dev: 88 (B)
Top student: Ana
Average: 85.5`,
      },
    },
  ],

  "quantum-physics": [
    {
      body: `## ⚛️ What is quantum physics?

### 🌍 Quick Overview
**Quantum physics** describes how nature behaves at the smallest scales: atoms, electrons and particles of light (**photons**). At that size, the everyday rules of classical physics stop working.

### 📌 Key Points
- **Energy comes in chunks.** In 1900, **Max Planck** found that light's energy is emitted in tiny packets called **quanta**.
- **Light acts like particles.** In 1905, **Albert Einstein** explained the **photoelectric effect**, where light knocks electrons out of metal, by treating light as particles. That work earned him the Nobel Prize.
- **Atoms have energy levels.** Electrons can only sit at certain energies, which is why each element glows in its own specific colors.
- **It's about probabilities.** Quantum physics predicts the *odds* of an outcome, not certainties.

### 🤯 Did You Know?
Einstein's Nobel Prize wasn't for relativity. It was for the photoelectric effect, one of the founding ideas of quantum physics.

**Question:** if energy comes in chunks, why does the world around us feel so smooth and continuous?`,
      sources: [
        src("qp1-1", "Quantum mechanics - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_mechanics"),
        src("qp1-2", "Photoelectric effect - Wikipedia", "https://en.wikipedia.org/wiki/Photoelectric_effect"),
      ],
    },
    {
      body: `## 🌊 Wave–particle duality

### 🌍 Quick Overview
Light and matter behave like **waves** in some experiments and like **particles** in others. The **double-slit experiment** shows this most clearly.

### 📌 Key Points
- **Two slits, one pattern.** Shine light through two narrow slits and you get stripes of light and dark: an **interference pattern**, which is a sign of waves.
- **Even one at a time.** Send electrons through **one by one** and each lands as a single dot, but over time the dots build up the *same* striped pattern.
- **Looking changes things.** If you measure which slit each electron goes through, the stripes disappear.
- **Matter has a wavelength.** **Louis de Broglie** proposed in 1924 that all matter has a wavelength. It's just far too small to notice for everyday objects.

### 🤯 Did You Know?
Electron microscopes depend on this idea: an electron's wavelength is much shorter than visible light's, so it can show far finer detail.

**Question:** why do you think measuring the electron's path makes the interference pattern disappear?`,
      sources: [
        src("qp2-1", "Double-slit experiment - Wikipedia", "https://en.wikipedia.org/wiki/Double-slit_experiment"),
        src("qp2-2", "Wave–particle duality - Wikipedia", "https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality"),
      ],
    },
    {
      body: `## 🎲 Uncertainty, superposition and entanglement

### 🌍 Quick Overview
Three ideas make quantum physics feel truly strange, and all three have been confirmed by experiments.

### 📌 Key Points
- **Uncertainty:** **Heisenberg** showed in 1927 that you can't know both a particle's exact position *and* its exact momentum. It's a property of nature, not a limit of our tools.
- **Superposition:** until it's measured, a system can be in a combination of states. **Schrödinger's cat** (1935) was a thought experiment meant to show how odd that sounds at everyday scales.
- **Entanglement:** two particles can share one quantum state, so measuring one instantly tells you about the other, even light-years away.
- **No faster-than-light messages:** entanglement can't be used to send information, so relativity is safe.

### 🤯 Did You Know?
The **2022 Nobel Prize in Physics** went to Alain Aspect, John Clauser and Anton Zeilinger for experiments with entangled photons, which showed that Einstein's "spooky action at a distance" is real.

**Question:** if entanglement can't send messages, what do you think it *can* be useful for?`,
      sources: [
        src("qp3-1", "Uncertainty principle - Wikipedia", "https://en.wikipedia.org/wiki/Uncertainty_principle"),
        src("qp3-2", "Quantum entanglement - Wikipedia", "https://en.wikipedia.org/wiki/Quantum_entanglement"),
        src("qp3-3", "Schrödinger's cat - Wikipedia", "https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat"),
      ],
    },
    {
      body: `## 💻 Quantum physics in everyday technology

### 🌍 Quick Overview
Quantum physics isn't just theory. Much of modern technology only works because we understand it.

### 📌 Key Points
- **Transistors and computer chips:** they rely on the quantum behavior of electrons in **semiconductors**.
- **Lasers and LEDs:** they work by controlling how electrons jump between energy levels and release photons.
- **MRI scanners:** they use a quantum property of atomic nuclei called **spin**.
- **GPS:** it depends on **atomic clocks**, which keep time using the precise energy levels of atoms.
- **What's next:** **quantum computers** use superposition and entanglement to tackle problems like simulating molecules.

### 🤯 Did You Know?
A modern phone chip contains billions of transistors, each one a tiny device built on quantum physics.

**Question:** which of these technologies did you use today without realizing it depends on quantum physics?`,
      sources: [
        src("qp4-1", "Applications of quantum mechanics - Wikipedia", "https://en.wikipedia.org/wiki/Applications_of_quantum_mechanics"),
        src("qp4-2", "Atomic clock - Wikipedia", "https://en.wikipedia.org/wiki/Atomic_clock"),
      ],
    },
  ],

  "machine-learning": [
    {
      body: `## 🤖 What is machine learning?

### 🔑 Key Concept
In normal programming, **you write the rules**. In **machine learning**, you give the computer **examples** and it works out the rules itself.

- **Supervised learning:** learn from labeled examples (these emails are spam, these aren't)
- **Unsupervised learning:** find structure in unlabeled data (group customers with similar habits)
- **Reinforcement learning:** learn by trial and error from rewards (game-playing AIs)

The example below is one of the simplest learners there is: **nearest neighbor**. To label a new point, it finds the most similar example it has seen and copies that example's label.

### 💡 Why it matters
Spam filters, recommendations, photo search and voice assistants all learn from data instead of hand-written rules.

### 🏋️ Practice Exercise
Add a third animal, "bird", with two example points of its own, and test a point near them.

**Question:** what could go wrong if all your training examples came from one kind of situation?`,
      sources: [
        src("ml1-1", "Machine learning - Wikipedia", "https://en.wikipedia.org/wiki/Machine_learning"),
        src("ml1-2", "k-nearest neighbors algorithm - Wikipedia", "https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm"),
      ],
      example: {
        language: "python",
        code: `# Tiny "learn from examples" classifier: 1-nearest neighbor
examples = [
    ((1.0, 1.2), "cat"),
    ((1.3, 0.9), "cat"),
    ((4.8, 5.1), "dog"),
    ((5.2, 4.7), "dog"),
]

def predict(point):
    def distance(example):
        (x, y), _ = example
        return (x - point[0]) ** 2 + (y - point[1]) ** 2
    return min(examples, key=distance)[1]

print(predict((1.1, 1.0)))
print(predict((4.9, 5.0)))`,
        output: `cat
dog`,
      },
    },
    {
      body: `## 🧠 Neural networks

### 🔑 Key Concept
A **neural network** is made of simple units called **neurons**. Each one:

1. Multiplies every input by a **weight** (how much that input matters)
2. Adds them up, plus a **bias**
3. Passes the total through an **activation function**, here a **sigmoid**, which squashes it into the range 0 to 1

Stack many neurons into **layers** and connect them, and the network can represent very complex patterns, like recognizing handwritten digits.

### 💡 Why it matters
Image recognition, translation and chatbots like Gemini are all built from huge networks of these simple units, with **billions** of weights.

### 🏋️ Practice Exercise
Change the weights in the example below so the neuron's output is **above 0.9**. What did you have to do?

**Question:** if a neuron is this simple, where does a network's "intelligence" actually come from?`,
      sources: [
        src("ml2-1", "Neural network (machine learning) - Wikipedia", "https://en.wikipedia.org/wiki/Neural_network_(machine_learning)"),
        src("ml2-2", "Sigmoid function - Wikipedia", "https://en.wikipedia.org/wiki/Sigmoid_function"),
      ],
      example: {
        language: "python",
        code: `import math

def neuron(inputs, weights, bias):
    total = sum(x * w for x, w in zip(inputs, weights)) + bias
    return 1 / (1 + math.exp(-total))  # sigmoid squashes it to 0..1

print(round(neuron([1.0, 0.5], [0.8, -0.4], 0.1), 3))`,
        output: `0.668`,
      },
    },
    {
      body: `## 📉 How models learn: loss and gradient descent

### 🔑 Key Concept
Learning means **finding the weights that make the fewest mistakes**.

- A **loss function** measures how wrong the model is. Here it's the average squared error.
- The **gradient** says which direction to nudge each weight to reduce the loss.
- **Gradient descent** repeats the nudge many times. The **learning rate** controls how big each step is.

The example below learns the rule **y = 2x** from three examples, starting from a weight of 0. Watch the loss shrink as w approaches 2.

### 💡 Why it matters
The same loop, scaled up to billions of weights and huge datasets, is how modern neural networks are trained.

### 🏋️ Practice Exercise
Try a learning rate of **0.1** instead. Does w get to 2 faster? Now try **0.25**. What happens to w, and why?

**Question:** why might a learning rate that's *too small* also be a problem?`,
      sources: [
        src("ml3-1", "Gradient descent - Wikipedia", "https://en.wikipedia.org/wiki/Gradient_descent"),
        src("ml3-2", "Loss function - Wikipedia", "https://en.wikipedia.org/wiki/Loss_function"),
      ],
      example: {
        language: "python",
        code: `# Learn w in y = w * x from data, using gradient descent
data = [(1, 2), (2, 4), (3, 6)]
w = 0.0
learning_rate = 0.01

for step in range(1, 41):
    grad = sum(2 * (w * x - y) * x for x, y in data) / len(data)
    w -= learning_rate * grad
    if step % 10 == 0:
        loss = sum((w * x - y) ** 2 for x, y in data) / len(data)
        print(f"step {step}: w = {w:.3f}, loss = {loss:.5f}")`,
        output: `step 10: w = 1.249, loss = 2.63039
step 20: w = 1.718, loss = 0.37066
step 30: w = 1.894, loss = 0.05223
step 40: w = 1.960, loss = 0.00736`,
      },
    },
    {
      body: `## 🔄 Backpropagation and avoiding overfitting

### 🔑 Key Concept
In a network with many layers, **backpropagation** works out how much each weight contributed to the error. It starts at the output and works **backwards**, layer by layer, using the chain rule from calculus. Gradient descent then updates every weight.

But a model can get *too* good at its training data. It **memorizes** the examples instead of learning the pattern. This is called **overfitting**. To catch it:

- **Split your data.** Train on most of it (often 80%), and keep a **test set** the model never sees during training.
- If training accuracy keeps rising but test accuracy drops, the model is overfitting.
- Fixes include **more data**, **simpler models** and **regularization**.

### 💡 Why it matters
A model is only useful if it works on **new** data, not just the examples it studied.

### 🏋️ Practice Exercise
Change the split in the example below to 70/30. How many examples end up in each set?

**Question:** why shouldn't you tune your model over and over based on the test set?`,
      sources: [
        src("ml4-1", "Backpropagation - Wikipedia", "https://en.wikipedia.org/wiki/Backpropagation"),
        src("ml4-2", "Overfitting - Wikipedia", "https://en.wikipedia.org/wiki/Overfitting"),
      ],
      example: {
        language: "python",
        code: `import random

random.seed(42)
data = list(range(1, 21))
random.shuffle(data)

split = int(len(data) * 0.8)
train, test = data[:split], data[split:]
print("train:", len(train), "examples")
print("test: ", len(test), "examples")`,
        output: `train: 16 examples
test:  4 examples`,
      },
    },
  ],
};

function courseComplete(prompt: string) {
  const others = LEARN_COURSES.filter((c) => c.prompt !== prompt).map((c) => `- **${c.prompt}**`);
  return `## 🎓 You finished this demo course!

### 🌍 Quick Overview
That's every lesson written for **${prompt.replace(/^(learn|teach me|help me understand)\s*/i, "")}** in this demo. In the original app, Gemini kept generating new lessons for as long as you wanted, each one building on the topics you'd already covered.

### 📌 Try another course
Start a **New Chat** from the sidebar and pick one of these:
${others.join("\n")}

**Question:** what would you want lesson 5 to cover?`;
}

const FALLBACK = `## 👋 About this demo

### 🌍 Quick Overview
The original Repose AI used **Gemini 2.0 Flash** to write a brand new lesson on any topic, then kept building the course with each **Continue Learning** click.

The live AI is switched off in this demo, so it can run for free without API keys. Lessons are **pre-written** for a few courses instead.

### 📌 Available courses
Start a **New Chat** from the sidebar and pick one of these:
${LEARN_COURSES.map((c) => `- **${c.prompt}**`).join("\n")}

**Question:** which one do you want to try first?`;

function lessonText(lesson: Lesson) {
  if (!lesson.example) return lesson.body;
  const { language, code, output } = lesson.example;
  return `${lesson.body}\n\n${F}${language}\n${code}\n${F}\n\n${F}output\n${output}\n${F}`;
}

/** Returns the pre-written lesson for a course topic and lesson number (1-based). */
export function pickLesson(topic: string, lessonNumber: number) {
  const course = findCourse(topic);
  if (!course) return { text: FALLBACK, sources: [] as DemoSource[] };
  const lesson = COURSES[course.key][lessonNumber - 1];
  if (!lesson) return { text: courseComplete(course.prompt), sources: [] as DemoSource[] };
  return { text: lessonText(lesson), sources: lesson.sources };
}

/** Every code example in the courses, with its real output. */
export const LESSON_EXAMPLES: CodeExample[] = Object.values(COURSES)
  .flat()
  .flatMap((lesson) => (lesson.example ? [lesson.example] : []));
