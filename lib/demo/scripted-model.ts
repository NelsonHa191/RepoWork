// lib/demo/scripted-model.ts
// A stand-in for google("gemini-2.0-flash-001"). It plugs into the Vercel AI
// SDK exactly where Gemini did, but streams a pre-written answer (plus its
// sources) instead of calling an API. So the rest of the app (useChat,
// streaming, sources, annotations) works unchanged, with no API key.

import { simulateReadableStream, type LanguageModel } from "ai";
import type { DemoSource } from "./explore-content";

type StreamPart = { type: string; [key: string]: unknown };

/** Splits text into small chunks (about two words each) to mimic token streaming. */
function toChunks(text: string) {
  const words = text.match(/\S+\s*|\s+/g) ?? [];
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 2) {
    chunks.push(words.slice(i, i + 2).join(""));
  }
  return chunks;
}

export function scriptedModel(
  reply: { text: string; sources?: DemoSource[] },
  { chunkDelayInMs = 15, initialDelayInMs = 350 } = {}
): LanguageModel {
  const sources = reply.sources ?? [];
  const usage = { promptTokens: 0, completionTokens: Math.ceil(reply.text.length / 4) };
  const rawCall = { rawPrompt: null, rawSettings: {} };

  return {
    specificationVersion: "v1",
    provider: "repose-demo",
    modelId: "scripted-demo",
    defaultObjectGenerationMode: undefined,

    async doGenerate() {
      return {
        text: reply.text,
        finishReason: "stop" as const,
        usage,
        rawCall,
        sources: sources.map((s) => ({ sourceType: "url" as const, ...s })),
      };
    },

    async doStream() {
      const parts: StreamPart[] = [
        ...toChunks(reply.text).map((textDelta) => ({ type: "text-delta", textDelta })),
        ...sources.map((s) => ({ type: "source", source: { sourceType: "url", ...s } })),
        { type: "finish", finishReason: "stop", usage },
      ];
      return {
        stream: simulateReadableStream({
          chunks: parts,
          initialDelayInMs,
          chunkDelayInMs,
        }) as Awaited<ReturnType<LanguageModel["doStream"]>>["stream"],
        rawCall,
      };
    },
  };
}
