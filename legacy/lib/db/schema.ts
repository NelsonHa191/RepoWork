// lib/db/schema.ts
import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  json,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  title: text("title").notNull(),
  mode: varchar("mode", { length: 20 }).default("explore"), // Add mode field to differentiate between explore and learn
});

export const chatsInsertSchema = createInsertSchema(chats);
export const chatsSelectSchema = createSelectSchema(chats);
export type Chat = InferSelectModel<typeof chats>;

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  fromSuggestionId: uuid("from_suggestion_id"), // If the message was created from a suggestion
  annotations: json("annotations"), // To store suggestions, fromSuggestionId, etc.
  createdAt: timestamp("created_at").notNull(),
});

// New table for learn-specific data
export const learnSessions = pgTable("learn_sessions", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  currentLesson: integer("current_lesson").notNull().default(1),
  lessonTopic: text("lesson_topic").notNull(),
  lessonSequence: json("lesson_sequence").notNull(), // Array of lesson topics
  lastVideoQuery: text("last_video_query"), // Last video query if any
  updatedAt: timestamp("updated_at").notNull(),
});

export const learnSessionsRelations = relations(learnSessions, ({ one }) => ({
  chat: one(chats, {
    fields: [learnSessions.chatId],
    references: [chats.id],
  }),
}));

export const messagesInsertSchema = createInsertSchema(messages);
export const messagesSelectSchema = createSelectSchema(messages);
export type DBMessage = InferSelectModel<typeof messages>;

export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
