// app/(chat)/learn/[id]/page.component.tsx
import LearnChat from "@/components/learn-chat";
import { auth } from "@/lib/auth";
import {
  getChatById,
  getMessagesByChatId,
  getLearnSessionByChatId,
} from "@/lib/db/queries";
import { DBMessage } from "@/lib/db/schema";
import { UIMessage } from "ai";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Define the expected structure for a text part
interface TextPart {
  type: "text";
  text: string;
}

export async function learn_page_component(props: { params: { id: string } }) {
  // Get the session and extract user if it exists
  let user = null;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user) {
      user = session.user;
    }
  } catch (error) {
    console.error("Error getting session:", error);
  }

  const { id } = props.params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  // Check if this is a learn mode chat
  if (chat.mode !== "learn") {
    notFound();
  }

  const messagesFromDb = await getMessagesByChatId({ id });
  const learnSession = await getLearnSessionByChatId({ chatId: id });

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts
        ? (message.parts as UIMessage["parts"])
        : [{ type: "text", text: "" }],
      role: message.role as UIMessage["role"],
      // content will get deprecated in the future
      content:
        message.parts && Array.isArray(message.parts)
          ? (
              message.parts.find(
                (part: any) =>
                  part &&
                  typeof part === "object" &&
                  "type" in part &&
                  part.type === "text"
              ) as TextPart
            )?.text || ""
          : "",
      createdAt: message.createdAt,
      annotations: message.annotations as UIMessage["annotations"],
    }));
  }

  const uiMessages = convertToUIMessages(messagesFromDb);

  // Extract the initial session data
  const initialSession = learnSession
    ? {
        currentLesson: learnSession.currentLesson,
        lessonTopic: learnSession.lessonTopic,
        lessonSequence: learnSession.lessonSequence as string[],
        lastVideoQuery: learnSession.lastVideoQuery || undefined,
      }
    : null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <LearnChat
        id={id}
        user={user}
        initialMessages={uiMessages}
        initialSession={initialSession}
      />
    </div>
  );
}
