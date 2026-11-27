// app/(chat)/api/explore/route.ts (demo version)
// Same streaming response as the original route, but the answer and the three
// follow-up suggestions are pre-written instead of coming from Gemini.
// Original: legacy/app/(chat)/api/explore/route.ts
import { createDataStreamResponse, streamText } from "ai";
import { generateUUID } from "@/lib/utils";
import { pickExploreReply } from "@/lib/demo/explore-content";
import { scriptedModel } from "@/lib/demo/scripted-model";
import { badRequest, readChatBody } from "@/lib/demo/request";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await readChatBody(req);
  if (!body) return badRequest();

  const userMessage = body.messages.filter((m) => m.role === "user").at(-1);
  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const fromSuggestionId = body.fromSuggestionId ?? undefined;
  const reply = pickExploreReply(userMessage.content);

  // Same shape that generateSuggestions() returned in the original
  const suggestions = {
    suggestions: reply.suggestions.map((content) => ({
      id: generateUUID(),
      messageId: userMessage.id ?? "",
      content,
      selected: false,
    })),
  };

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: scriptedModel(reply),
        prompt: userMessage.content,
        onFinish: () => {
          dataStream.writeMessageAnnotation({
            suggestions,
            ...(fromSuggestionId ? { fromSuggestionId } : {}),
          });
        },
      });

      result.mergeIntoDataStream(dataStream, { sendSources: true });
    },
    onError: () => "An error occurred while processing your request",
  });
}
