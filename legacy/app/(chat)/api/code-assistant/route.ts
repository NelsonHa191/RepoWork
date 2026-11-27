import { google } from "@ai-sdk/google";
import { createDataStreamResponse, streamText } from "ai";
import { Message } from "@ai-sdk/react";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Detect if this is a code execution request
  const isExecutionRequest = messages.some(
    (message: Message) =>
      message.role === "user" &&
      typeof message.content === "string" &&
      message.content.includes("What would be the output of running this") &&
      message.content.includes("code?")
  );

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: google("gemini-2.0-flash-001", {
          useSearchGrounding: true,
        }),
        system: isExecutionRequest
          ? `
          - You are a code execution simulator that provides clean, accurate output.
          - When given code in any programming language, predict what the output would be if the code were executed.
          - Return ONLY the exact output - no formatting, no backticks, no "Output:", just the raw output as it would appear.
          - If there would be an error, return just the error message as it would appear.
          - If the code has no output, say "No output".
          - For interactive programs requiring input, assume reasonable default inputs.
          - Be minimal and precise - don't add any explanations or decorations to the output.
          - Example: For 'print("Hello World")' in Python, your entire response should be just "Hello World"
          `
          : `
          - You are a code assistant designed to help developers write, understand, and debug code.
          - When provided with code:
            - Identify any potential issues, bugs, or inefficiencies
            - Suggest improvements in clarity, performance, or security
            - Explain complex sections clearly and concisely
            - Provide educational context about specific functions, libraries, or patterns
            - Offer alternative approaches when appropriate
          - When answering questions:
            - Provide code examples that are clear and well-documented
            - Follow best practices for the language in question
            - Be pragmatic and focused on real-world application
          - Always:
            - Provide complete, working solutions when possible
            - Explain your reasoning, especially for complex suggestions
            - Maintain a helpful, educational tone
          `,
        messages,
        temperature: isExecutionRequest ? 0.1 : 0.5, // Lower temperature for execution to be more precise
      });

      result.mergeIntoDataStream(dataStream, { sendSources: true });
    },
  });
}
