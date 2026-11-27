// app/(chat)/api/code-assistant/route.ts (demo version)
// The original asked Gemini to predict a program's output or review the code.
// The demo answers from the built-in examples (whose outputs were recorded by
// really running them) and explains the limits for anything else.
// Original: legacy/app/(chat)/api/code-assistant/route.ts
import { createDataStreamResponse, streamText } from "ai";
import { CODE_SAMPLES, sameCode } from "@/lib/demo/code-samples";
import { LESSON_EXAMPLES } from "@/lib/demo/learn-content";
import { scriptedModel } from "@/lib/demo/scripted-model";
import { badRequest, readChatBody } from "@/lib/demo/request";

export const maxDuration = 30;

const F = "```";

function extractCode(prompt: string) {
  const match = prompt.match(/```[a-zA-Z0-9+#]*\n([\s\S]*?)```/);
  return match ? match[1] : "";
}

function executionReply(language: string, code: string) {
  const known = [...Object.values(CODE_SAMPLES), ...LESSON_EXAMPLES].find(
    (s) => s.language === language && sameCode(s.code, code)
  );
  if (known) return known.output;
  return `[Demo] Running ${language} code needs the AI backend, which is switched off in this demo.

- JavaScript runs for real, right in your browser: pick JavaScript and press Run.
- The built-in example for each language still shows its real output. Clear the editor (or switch languages) to bring it back.`;
}

function reviewReply(language: string, code: string) {
  const sample = Object.values(CODE_SAMPLES).find(
    (s) => s.language === language && sameCode(s.code, code)
  );
  if (sample) return sample.review;

  const lines = code.split("\n").filter((l) => l.trim()).length;
  return `### The AI review is offline in this demo

The original Code Playground sent your code to **Gemini 2.0 Flash**, which explained it, pointed out bugs and suggested improvements. That needs an API key, so it's switched off here.

Your ${language} snippet has **${lines} non-empty line${lines === 1 ? "" : "s"}**. To see what a review looked like, switch back to the built-in **${language}** example (or clear the editor) and open this tab again.

${F}text
Built-in examples: ${Object.keys(CODE_SAMPLES).join(", ")}
${F}`;
}

export async function POST(req: Request) {
  const body = await readChatBody(req);
  if (!body) return badRequest();

  const last = body.messages.filter((m) => m.role === "user").at(-1);
  if (!last) return badRequest();

  const prompt = last.content;
  const isExecutionRequest =
    prompt.includes("What would be the output of running this") && prompt.includes("code?");
  const language =
    prompt.match(/(?:running this|working with) ([a-z+#]+) code/i)?.[1]?.toLowerCase() ?? "python";
  const code = extractCode(prompt);

  const text = isExecutionRequest ? executionReply(language, code) : reviewReply(language, code);

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: scriptedModel({ text }, { chunkDelayInMs: isExecutionRequest ? 5 : 12 }),
        prompt,
      });
      result.mergeIntoDataStream(dataStream);
    },
  });
}
