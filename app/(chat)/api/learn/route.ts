// app/(chat)/api/learn/route.ts (demo version)
// Streams the next pre-written lesson for the course the user picked.
// Original: legacy/app/(chat)/api/learn/route.ts
import { createDataStreamResponse, streamText } from "ai";
import { pickLesson } from "@/lib/demo/learn-content";
import { scriptedModel } from "@/lib/demo/scripted-model";
import { badRequest, readChatBody } from "@/lib/demo/request";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await readChatBody(req);
  if (!body) return badRequest();

  const messages = body.messages;
  const userMessage = messages.filter((m) => m.role === "user").at(-1);
  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  // The course comes from the topic the user first typed. The lesson number is
  // one more than the number of lessons already shown.
  const firstUserMessage = messages.find((m) => m.role === "user");
  const topic = body.lessonTopic || firstUserMessage?.content || userMessage.content;
  const lessonNumber = messages.filter((m) => m.role === "assistant").length + 1;
  const lesson = pickLesson(topic, lessonNumber);

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: scriptedModel(lesson),
        prompt: userMessage.content,
      });

      result.mergeIntoDataStream(dataStream, { sendSources: true });
    },
    onError: () => "An error occurred while processing your request",
  });
}
