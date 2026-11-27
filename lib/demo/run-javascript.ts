"use client";

// lib/demo/run-javascript.ts
// Runs JavaScript from the Code Playground for real, inside a throwaway Web
// Worker in the visitor's own browser. The worker has no access to the page,
// cookies or storage. Network APIs are removed, and it's killed after a
// timeout so an infinite loop can't freeze the tab. The original app asked
// Gemini to *predict* the output instead.

const PRELUDE = `
const __fmt = (v) => {
  if (typeof v === "string") return v;
  if (v instanceof Error) return v.name + ": " + v.message;
  try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch { return String(v); }
};
const __log = (...args) => self.postMessage({ type: "log", line: args.map(__fmt).join(" ") });
console.log = console.info = console.warn = console.error = console.debug = __log;
for (const api of ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts", "indexedDB", "caches"]) {
  try { Object.defineProperty(self, api, { value: undefined }); } catch {}
}
self.addEventListener("unhandledrejection", (e) => __log("Uncaught (in promise)", e.reason));
`;

// Wait briefly after the code finishes so short timers and promises can log.
const EPILOGUE = `
;setTimeout(() => self.postMessage({ type: "done" }), 100);
`;

export function runJavaScript(code: string, timeoutMs = 3000): Promise<string> {
  return new Promise((resolve) => {
    const lines: string[] = [];
    const blob = new Blob([PRELUDE, "\n", code, "\n", EPILOGUE], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    const finish = (extra?: string) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      if (extra) lines.push(extra);
      resolve(lines.length ? lines.join("\n") : "No output");
    };

    const timer = setTimeout(
      () => finish(`Stopped: the code was still running after ${timeoutMs / 1000} seconds.`),
      timeoutMs
    );

    worker.onmessage = (e: MessageEvent<{ type: string; line?: string }>) => {
      if (e.data?.type === "log" && typeof e.data.line === "string") lines.push(e.data.line);
      if (e.data?.type === "done") finish();
    };
    worker.onerror = (e: ErrorEvent) => {
      e.preventDefault();
      finish(e.message || "Error while running the code");
    };
  });
}
