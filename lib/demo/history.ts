"use client";

// lib/demo/history.ts
// Saves chats in the browser's localStorage instead of the Neon Postgres
// database. Each chat keeps the same information the chats, messages and
// learn_sessions tables did. Chats stay in this browser only.

import { useSyncExternalStore } from "react";
import type { UIMessage } from "ai";

const STORAGE_KEY = "repose-demo-chats-v1";
const CHANGE_EVENT = "repose-demo-history-change";
const MAX_CHATS = 50;

export type LearnSession = {
  currentLesson: number;
  lessonTopic: string;
  lessonSequence: string[];
  lastVideoQuery?: string;
};

export type StoredChat = {
  id: string;
  title: string;
  mode: "explore" | "learn";
  createdAt: string;
  messages: UIMessage[];
  learnSession?: LearnSession;
};

/** The fields the sidebar needs (matches the original `Chat` row). */
export type ChatSummary = Pick<StoredChat, "id" | "title" | "mode" | "createdAt">;

function readAll(): StoredChat[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(chats: StoredChat[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, MAX_CHATS)));
  } catch {
    // Storage full or disabled (private mode): the demo still works, it just won't remember.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getChat(id: string): StoredChat | undefined {
  const chat = readAll().find((c) => c.id === id);
  if (!chat) return undefined;
  return {
    ...chat,
    messages: chat.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
    })),
  };
}

export function saveChat(chat: Omit<StoredChat, "createdAt">) {
  const chats = readAll();
  const existing = chats.find((c) => c.id === chat.id);
  const record: StoredChat = {
    ...chat,
    title: (existing?.title ?? chat.title).slice(0, 120),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  writeAll([record, ...chats.filter((c) => c.id !== chat.id)]);
}

export function resetDemo() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// --- React hook for the sidebar -------------------------------------------

let cachedRaw: string | null | undefined;
let cachedSummaries: ChatSummary[] = [];
const EMPTY: ChatSummary[] = [];

function getSnapshot(): ChatSummary[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSummaries = readAll()
      .map(({ id, title, mode, createdAt }) => ({ id, title, mode, createdAt }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first, like the original query
  }
  return cachedSummaries;
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useChatHistory(): ChatSummary[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
