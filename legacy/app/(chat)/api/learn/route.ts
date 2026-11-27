// app/(chat)/api/learn/route.ts
import { google } from "@ai-sdk/google";
import {
  createDataStreamResponse,
  streamText,
  appendResponseMessages,
} from "ai";
import { generateSuggestions } from "@/app/(chat)/actions";
import { getMostRecentUserMessage, generateUUID } from "@/lib/utils";
import {
  getChatById,
  saveChat,
  saveMessages,
  saveLearnSession,
  getLearnSessionByChatId,
} from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      id,
      messages,
      lessonTopic,
      currentLesson = 1,
      lessonSequence = [],
      lastVideoQuery = null,
      fromSuggestionId = undefined,
      selectedChatModel = "gemini-2.0-flash-001",
    } = await req.json();

    // Get the last user message to link to suggestions
    const userMessage = getMostRecentUserMessage(messages);
    if (!userMessage) {
      return new Response("No user message found", { status: 400 });
    }

    // Optional: Try to get session if auth is implemented
    let session = null;
    let userId = null;
    try {
      const authSession = await auth.api.getSession({
        headers: await headers(),
      });

      // Extract user ID if session exists
      if (authSession?.user) {
        userId = authSession.user.id;
      }
    } catch (error) {
      // Continue even if auth is not fully implemented or session fails
      console.log("Auth not configured or session error:", error);
    }

    // Perform DB operations only if user ID exists
    if (userId) {
      // Check if the chat exists
      const chat = await getChatById({ id });

      // Set the chat title to the lesson topic or first message
      const title = lessonTopic || userMessage.content.substring(0, 50);

      // If the chat does not exist, create it
      if (!chat) {
        await saveChat({
          id: id,
          userId: userId,
          title: title,
          mode: "learn",
        });

        // Save or update learn session data
        await saveLearnSession({
          id: generateUUID(),
          chatId: id,
          currentLesson: currentLesson,
          lessonTopic: lessonTopic || userMessage.content,
          lessonSequence:
            lessonSequence.length > 0 ? lessonSequence : [userMessage.content],
          lastVideoQuery: lastVideoQuery,
        });
      } else {
        // If chat exists but session data might need an update
        const existingSession = await getLearnSessionByChatId({ chatId: id });

        if (existingSession) {
          // Update the existing session with new values
          await saveLearnSession({
            id: existingSession.id,
            chatId: id,
            currentLesson: currentLesson,
            lessonTopic: lessonTopic || existingSession.lessonTopic,
            lessonSequence:
              lessonSequence.length > 0
                ? lessonSequence
                : (existingSession.lessonSequence as string[]),
            lastVideoQuery: lastVideoQuery || existingSession.lastVideoQuery,
          });
        } else {
          // Create new session data if somehow it was missing
          await saveLearnSession({
            id: generateUUID(),
            chatId: id,
            currentLesson: currentLesson,
            lessonTopic: lessonTopic || userMessage.content,
            lessonSequence:
              lessonSequence.length > 0
                ? lessonSequence
                : [userMessage.content],
            lastVideoQuery: lastVideoQuery,
          });
        }
      }

      // Save the user message to DB
      await saveMessages({
        message: [
          {
            id: userMessage.id,
            chatId: id,
            role: "user",
            parts: userMessage.parts,
            fromSuggestionId: fromSuggestionId,
            annotations: userMessage.annotations,
            createdAt: new Date(),
          },
        ],
      });
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: google(selectedChatModel, {
            useSearchGrounding: true,
          }),
          system: `
          - You are a teaching assistant designed to deliver engaging, concise learning content.
          - Your goal is to create bite-sized educational content that's easy to understand.
          - Format your responses for maximum clarity and visual organization:
            - Use clear section headers with emoji icons
            - Break complex ideas into bullet points
            - Bold important concepts
            - Use markdown formatting extensively
          
          ${
            isCodeRelated(userMessage.content)
              ? `
          - For this technical topic:
            - Start with a **Key Concept** section that explains one fundamental idea
            - Include at least one code example using markdown code blocks with the appropriate language tag
            - Make sure code examples are simple and demonstrate clear output
            - End with a **Practice Exercise** section that gives the learner something to try
          `
              : `
          - For this general knowledge topic:
            - Start with a **Quick Overview** section that provides context
            - Include a **Key Points** section with 3-5 bullet points of essential information
            - End with a **Did You Know?** section containing one fascinating fact
          `
          }
          
          - Always:
            - Keep explanations concise and focused
            - Use simple examples that relate to everyday experiences
            - End with a thoughtful question to spark further learning
            - Include helpful visuals whenever possible
            - Write in a friendly, conversational tone
          `,
          messages,
          temperature: 0.7,
          onFinish: async ({ response, sources, text }) => {
            // Generate suggestions based on the AI response text
            const suggestions = await generateSuggestions({
              messageContent: text,
              messageId: userMessage.id,
            });

            // Write the suggestions to the data stream
            dataStream.writeMessageAnnotation({
              suggestions: suggestions,
              fromSuggestionId,
            });

            // Only save assistant message if userId exists
            if (userId) {
              try {
                // Append the response messages to get the assistant message
                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                // Generate a new assistant message id
                const newAssistantId = generateUUID();

                // Save the assistant message to the database (including sources)
                await saveMessages({
                  message: [
                    {
                      id: newAssistantId,
                      chatId: id,
                      role: "assistant",
                      parts: [
                        ...(assistantMessage.parts ?? []),
                        ...(sources ?? []).map((source) => ({
                          type: "source",
                          source: {
                            id: source.id,
                            url: source.url,
                            title: source.title,
                          },
                        })),
                      ],
                      fromSuggestionId: fromSuggestionId,
                      annotations: [{ suggestions, fromSuggestionId }],
                      createdAt: new Date(),
                    },
                  ],
                });

                // Save or update learn session with the latest message
                // If this is not a message from a suggestion (new lesson), update the lesson sequence
                if (!fromSuggestionId && userId) {
                  const existingSession = await getLearnSessionByChatId({
                    chatId: id,
                  });
                  if (existingSession) {
                    // Extract topic from assistant response
                    let topicLine = "";
                    const textPart = assistantMessage.parts?.find(
                      (part) => part.type === "text"
                    );

                    if (textPart && textPart.type === "text") {
                      const firstLine = textPart.text.split("\n")[0];
                      topicLine =
                        firstLine.length > 10 && firstLine.length < 80
                          ? firstLine
                          : textPart.text.substring(0, 40) + "...";
                    }

                    // Update lesson sequence with new topic if appropriate
                    const updatedSequence = [
                      ...(existingSession.lessonSequence as string[]),
                    ];
                    if (currentLesson >= updatedSequence.length && topicLine) {
                      updatedSequence.push(topicLine);
                    }

                    await saveLearnSession({
                      id: existingSession.id,
                      chatId: id,
                      currentLesson: currentLesson,
                      lessonTopic: existingSession.lessonTopic,
                      lessonSequence: updatedSequence,
                      lastVideoQuery: lastVideoQuery,
                    });
                  }
                }
              } catch (error) {
                console.error("Error saving assistant message:", error);
              }
            }
          },
        });

        result.mergeIntoDataStream(dataStream, { sendSources: true });
      },
      onError: () => {
        return "An error occurred while processing your request";
      },
    });
  } catch (error) {
    console.error("Error in POST route:", error);
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}

// Helper function to detect if a message is related to code/programming
function isCodeRelated(content: string): boolean {
  const technicalTopics = [
    "python",
    "javascript",
    "java",
    "coding",
    "programming",
    "react",
    "typescript",
    "html",
    "css",
    "sql",
    "database",
    "algorithm",
    "data structure",
    "machine learning",
    "ai",
    "web development",
    "app development",
    "software engineering",
    "code",
    "function",
    "class",
    "variable",
    "array",
    "object",
    "loop",
    "if statement",
    "api",
    "framework",
    "library",
  ];

  return technicalTopics.some((topic) =>
    content.toLowerCase().includes(topic.toLowerCase())
  );
}
