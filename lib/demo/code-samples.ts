// lib/demo/code-samples.ts
// Starter programs for the Code Playground. Each one has its real output
// (checked by actually running it) and a pre-written review, standing in for
// the answers Gemini used to give.

export type CodeSample = {
  language: string;
  code: string;
  output: string;
  review: string;
};

export const CODE_SAMPLES: Record<string, CodeSample> = {
  python: {
    language: "python",
    code: `def greet(name):
    return f"Hello, {name}!"

languages = ["Python", "JavaScript", "Rust"]
for i, lang in enumerate(languages, start=1):
    print(i, greet(lang))

squares = [n * n for n in range(1, 6)]
print("Squares:", squares)
print("Total:", sum(squares))`,
    output: `1 Hello, Python!
2 Hello, JavaScript!
3 Hello, Rust!
Squares: [1, 4, 9, 16, 25]
Total: 55`,
    review: `### What this code does
It defines a small **greet()** function, loops over a list with **enumerate()** to number each item starting at 1, then builds a list of squares with a **list comprehension**.

### What's good
- **enumerate(..., start=1)** is the idiomatic way to get a counter. Much cleaner than tracking i yourself.
- The list comprehension is short and readable.
- **f-strings** are the modern, fast way to format text.

### Suggestions
- Add **type hints** so editors can catch mistakes: def greet(name: str) -> str:
- If you only need the total, a **generator expression** avoids building the list: sum(n * n for n in range(1, 6))
- Wrap the script in an **if __name__ == "__main__":** block so it can be imported without running.`,
  },
  javascript: {
    language: "javascript",
    code: `const cart = [
  { item: "Notebook", price: 4.5, qty: 3 },
  { item: "Pen", price: 1.25, qty: 4 },
  { item: "Backpack", price: 32, qty: 1 },
];

const total = cart.reduce((sum, { price, qty }) => sum + price * qty, 0);
const names = cart.map((line) => line.item).join(", ");

console.log("Items:", names);
console.log(\`Total: $\${total.toFixed(2)}\`);
console.log("Most expensive:", cart.toSorted((a, b) => b.price - a.price)[0].item);`,
    output: `Items: Notebook, Pen, Backpack
Total: $50.50
Most expensive: Backpack`,
    review: `### What this code does
It totals a shopping cart with **reduce()**, lists the item names with **map()** and **join()**, and finds the most expensive item by sorting a copy of the array.

### What's good
- **Destructuring** ({ price, qty }) keeps the reducer short.
- **toSorted()** returns a *new* array, so the original cart isn't changed by accident (sort() would change it in place).
- **toFixed(2)** formats the money nicely.

### Suggestions
- Prices in floating point can drift (0.1 + 0.2 !== 0.3). For real money, store **cents as integers**.
- To find a maximum you don't need to sort. One pass with reduce() is O(n) instead of O(n log n).
- Use **Intl.NumberFormat** for currency so it formats correctly in every locale.`,
  },
  typescript: {
    language: "typescript",
    code: `interface Task {
  title: string;
  done: boolean;
  priority: "low" | "high";
}

const tasks: Task[] = [
  { title: "Write README", done: false, priority: "high" },
  { title: "Fix login bug", done: true, priority: "high" },
  { title: "Deploy demo", done: false, priority: "low" },
];

function remaining(list: Task[]): string[] {
  return list.filter((t) => !t.done).map((t) => t.title);
}

const left = remaining(tasks);
console.log(\`\${left.length} tasks left: \${left.join(", ")}\`);
console.log("High priority:", tasks.filter((t) => t.priority === "high").length);`,
    output: `2 tasks left: Write README, Deploy demo
High priority: 2`,
    review: `### What this code does
It describes a **Task** with an interface, then uses **filter()** and **map()** to list the titles of unfinished tasks and count the high-priority ones.

### What's good
- The **union type** "low" | "high" means a typo like "hgih" is caught at compile time.
- **remaining()** has a clear, typed signature, so it's easy to test and reuse.

### Suggestions
- Mark the array **readonly** (readonly Task[]) if functions shouldn't change it.
- If priorities grow, a lookup object such as const PRIORITY_ORDER = { low: 0, high: 1 } makes sorting by priority straightforward.
- Turn on **strict** mode in tsconfig.json to get the most out of the type checker.`,
  },
  java: {
    language: "java",
    code: `public class Main {
    public static void main(String[] args) {
        int[] scores = {88, 92, 79, 95};
        int total = 0;
        int best = scores[0];

        for (int s : scores) {
            total += s;
            best = Math.max(best, s);
        }

        System.out.println("Scores: " + scores.length);
        System.out.println("Average: " + (total / (double) scores.length));
        System.out.println("Best: " + best);
    }
}`,
    output: `Scores: 4
Average: 88.5
Best: 95`,
    review: `### What this code does
It loops over an array of scores once, keeping a running **total** and the **best** score, then prints the count, average and maximum.

### What's good
- One pass over the data computes everything. That's efficient and easy to follow.
- Casting to **double** before dividing avoids integer division (354 / 4 would give 88, not 88.5).

### Suggestions
- **Streams** can express this concisely: IntStream.of(scores).summaryStatistics() gives count, average, min and max at once.
- Guard against an **empty array**: scores[0] would throw an exception.
- Use **System.out.printf("%.1f%n", avg)** to control decimal places.`,
  },
  cpp: {
    language: "cpp",
    code: `#include <iostream>
#include <string>

int main() {
    for (int i = 1; i <= 15; ++i) {
        std::string out;
        if (i % 3 == 0) out += "Fizz";
        if (i % 5 == 0) out += "Buzz";
        std::cout << (out.empty() ? std::to_string(i) : out) << "\\n";
    }
    return 0;
}`,
    output: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz`,
    review: `### What this code does
It's the classic **FizzBuzz**: count from 1 to 15, printing "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for both.

### What's good
- Building the string up means **FizzBuzz** needs no special case of its own.
- Printing **"\\n"** instead of **std::endl** avoids flushing the output on every line, which is faster.

### Suggestions
- Make the limit a **constexpr int** (constexpr int kLimit = 15;) instead of a magic number.
- **return 0;** is optional at the end of main(), and many style guides leave it out.
- For larger programs, put the logic in a function such as std::string fizzbuzz(int i) so it can be unit-tested.`,
  },
};

export const RUNNABLE_IN_BROWSER = new Set(["javascript"]);

function normalizeCode(code: string) {
  return code.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}

export function sameCode(a: string, b: string) {
  return normalizeCode(a) === normalizeCode(b);
}
