"use server";

import { getChatsByUserId } from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * Generates suggestion options based on the AI's response
 */
export async function generateSuggestions({
  messageContent,
  messageId,
}: {
  messageContent: string;
  messageId: string;
}) {
  const { object: result } = await generateObject({
    model: google("gemini-2.0-flash-001"),
    system: `
      - you will generate three distinct suggestions to explore based on the user's message
      - the suggestion digs deeper into specific aspects of the topic 
      - the suggestion uses precise language to hint at interesting angles 
      - the suggestion encourages exploration of advanced, nuanced details related to the topic.
      - the suggestion can be in the form of a question
      `,
    prompt: messageContent,
    schema: z.array(z.string()),
    temperature: 0.7, // Compromise between 0.5 and 0.8
  });

  // Use generateUUID instead of generateId for consistency with the rest of the app
  const suggestions = result.map((suggestion) => ({
    id: generateUUID(),
    messageId: messageId,
    content: suggestion,
    selected: false,
  }));

  return { suggestions };
}

/**
 * Gets the chat history for a user with optional mode filtering
 */
export async function getHistoryByUserId(
  userId: string,
  mode: "explore" | "learn" | "all" = "all"
) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    const history = await getChatsByUserId({
      id: userId,
      mode: mode,
    });
    return history;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}
