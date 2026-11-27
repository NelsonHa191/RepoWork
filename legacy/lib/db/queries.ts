// lib/db/queries.ts
import { drizzle } from "drizzle-orm/neon-http";
import { chats, DBMessage, messages, learnSessions } from "./schema";
import { eq, asc, desc, and, isNotNull } from "drizzle-orm";
const db = drizzle(process.env.DATABASE_URL!);

export async function saveChat({
  id,
  userId,
  title,
  mode = "explore",
}: {
  id: string;
  userId: string;
  title: string;
  mode?: "explore" | "learn";
}) {
  try {
    return await db.insert(chats).values({
      id,
      userId,
      createdAt: new Date(),
      title,
      mode,
    });
  } catch (error) {
    console.error("Failed to save chat to database");
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  mode,
}: {
  id: string;
  mode?: "explore" | "learn" | "all";
}) {
  try {
    let query = db
      .select()
      .from(chats)
      .where(eq(chats.userId, id))
      .orderBy(desc(chats.createdAt));

    // Filter by mode if provided
    if (mode && mode !== "all") {
      query = db
        .select()
        .from(chats)
        .where(and(eq(chats.userId, id), eq(chats.mode, mode)))
        .orderBy(desc(chats.createdAt));
    }

    return await query;
  } catch (error) {
    console.error("Failed to get chats by user id from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat from database");
    throw error;
  }
}

export async function saveMessages({ message }: { message: Array<DBMessage> }) {
  try {
    return await db.insert(messages).values(message);
  } catch (error) {
    console.error("Failed to save messages to database", error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, id))
      .orderBy(asc(messages.createdAt));
  } catch (error) {
    console.error("Failed to get messages from database", error);
    throw error;
  }
}

export async function saveLearnSession({
  id,
  chatId,
  currentLesson,
  lessonTopic,
  lessonSequence,
  lastVideoQuery,
}: {
  id: string;
  chatId: string;
  currentLesson: number;
  lessonTopic: string;
  lessonSequence: string[];
  lastVideoQuery?: string;
}) {
  try {
    return await db
      .insert(learnSessions)
      .values({
        id,
        chatId,
        currentLesson,
        lessonTopic,
        lessonSequence,
        lastVideoQuery,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: learnSessions.id,
        set: {
          currentLesson,
          lessonSequence,
          lastVideoQuery,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error("Failed to save learn session to database", error);
    throw error;
  }
}

export async function getLearnSessionByChatId({ chatId }: { chatId: string }) {
  try {
    const [session] = await db
      .select()
      .from(learnSessions)
      .where(eq(learnSessions.chatId, chatId));
    return session;
  } catch (error) {
    console.error("Failed to get learn session from database", error);
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(chats).where(eq(chats.id, id));
  } catch (error) {
    console.error("Failed to delete chat from database", error);
    throw error;
  }
}

export async function deleteMessageById({ id }: { id: string }) {
  try {
    await db.delete(messages).where(eq(messages.id, id));
  } catch (error) {
    console.error("Failed to delete message from database", error);
    throw error;
  }
}

export async function updateAnnotationByMessageId({
  messageId,
  annotations,
}: {
  messageId: string;
  annotations: JSON;
}) {
  try {
    await db
      .update(messages)
      .set({ annotations })
      .where(eq(messages.id, messageId));
  } catch (error) {
    console.error("Failed to update annotation by message id", error);
    throw error;
  }
}
