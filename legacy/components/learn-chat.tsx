"use client";

import LearnMessages from "./learn-messages";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import { Message, useChat } from "@ai-sdk/react";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { generateUUID } from "@/lib/utils";
import { User } from "better-auth";
import { useRouter } from "next/navigation";

export default function LearnChat({
  id,
  initialMessages,
  initialSession = null,
  user,
  modeHandler,
}: {
  id: string;
  initialMessages: Message[];
  initialSession?: {
    currentLesson: number;
    lessonTopic: string;
    lessonSequence: string[];
    lastVideoQuery?: string;
  } | null;
  user?: User | null; // Updated to accept null
  modeHandler?: (mode: "explore" | "learn") => void;
}) {
  const router = useRouter();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [currentLesson, setCurrentLesson] = useState<number>(
    initialSession?.currentLesson || 1
  );
  const [lessonTopic, setLessonTopic] = useState<string>(
    initialSession?.lessonTopic || ""
  );
  const [lessonSequence, setLessonSequence] = useState<string[]>(
    initialSession?.lessonSequence || []
  );
  const [lastVideoQuery, setLastVideoQuery] = useState<string | undefined>(
    initialSession?.lastVideoQuery
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit, append, setInput } =
    useChat({
      id,
      initialMessages,
      generateId: generateUUID,
      sendExtraMessageFields: true,
      api: "/api/learn",
      body: {
        lessonTopic,
        currentLesson,
        lessonSequence,
        lastVideoQuery,
      },
      onFinish: (message) => {
        // For learn mode, we update the lesson sequence
        let lessonContent = "";
        if (message.parts?.[0]?.type === "text") {
          lessonContent = message.parts[0].text;
        }

        // Try to extract the topic from the content
        const firstLine = lessonContent.split("\n")[0];
        const topicLine =
          firstLine.length > 10 && firstLine.length < 80
            ? firstLine
            : lessonContent.substring(0, 40) + "...";

        // Update the lesson sequence with what we just learned
        if (currentLesson >= lessonSequence.length) {
          setLessonSequence([...lessonSequence, topicLine]);
        }

        setIsGenerating(false);
      },
    });

  // Update URL for authenticated users on first message
  useEffect(() => {
    if (user && messages.length > 0 && lessonTopic) {
      // Only update URL if we're not already on a specific learn page
      if (!window.location.pathname.includes("/learn/")) {
        window.history.replaceState({}, "", `/learn/${id}`);
      }
    }
  }, [messages.length, id, user, lessonTopic]);

  const scrollToLastMessage = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lastMessageRef]);

  const submitUserMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // For learn mode, initialize lesson sequence on first submission
      if (messages.length === 0) {
        setCurrentLesson(1);
        setLessonTopic(input);
        setLessonSequence([input]);
      }

      handleSubmit(e);
      setTimeout(scrollToLastMessage, 50);
    },
    [handleSubmit, scrollToLastMessage, input, messages.length]
  );

  // Generate the prompt for the next lesson based on what we've learned
  const generateNextLessonPrompt = useCallback(
    (learnedTopics: string[]): string => {
      if (learnedTopics.length === 0) return "";

      // Create a prompt that lists what we've already learned
      const mainTopic = lessonTopic || messages[0]?.content || "";
      let learnedContent = learnedTopics.join(", ");

      // If we're just starting, the first topic is just the main topic
      if (learnedTopics.length === 1) {
        return `I just started learning about ${mainTopic}. What should I learn next as a complete beginner?`;
      }

      return `I'm learning about ${mainTopic}. I've already learned about ${learnedContent}. What should I learn next as a logical progression?`;
    },
    [lessonTopic, messages]
  );

  const handleNextLesson = useCallback(() => {
    if (isGenerating) return;

    // Generate the prompt for the next lesson based on what we've learned
    const nextLessonPrompt = generateNextLessonPrompt(lessonSequence);
    if (!nextLessonPrompt) return;

    setIsGenerating(true);

    // If this is the first lesson, save the main topic
    if (lessonTopic === "" && messages.length > 0) {
      setLessonTopic(messages[0].content);
    }

    // Update UI immediately before waiting for response
    setCurrentLesson(currentLesson + 1);

    // Make the API request
    append(
      {
        role: "user",
        content: nextLessonPrompt,
      },
      {
        body: {
          lessonTopic,
          currentLesson: currentLesson + 1, // Send updated lesson count
          lessonSequence,
          lastVideoQuery,
        },
      }
    );

    setInput(""); // Clear the input field

    // Scroll to bottom with a slight delay to ensure the DOM has updated
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      scrollToLastMessage();
    }, 100);
  }, [
    isGenerating,
    generateNextLessonPrompt,
    lessonSequence,
    lessonTopic,
    messages,
    currentLesson,
    append,
    setInput,
    scrollToLastMessage,
    lastVideoQuery,
  ]);

  // Handle video playback
  const handleVideoQuery = useCallback((query: string) => {
    setLastVideoQuery(query);
  }, []);

  const firstMessageContent = useMemo(() => {
    return messages.length > 0 ? messages[0].content : "";
  }, [messages]);

  // if the messages is empty, show the onboarding chat input
  if (messages.length === 0) {
    return (
      <ChatInput
        onboarding={true}
        submitUserMessage={submitUserMessage}
        input={input}
        handleInputChange={handleInputChange}
        mode="learn"
        setMode={modeHandler}
      />
    );
  }

  // if the messages is not empty, show the chat
  return (
    <>
      <ChatHeader
        firstMessageContent={firstMessageContent}
        mode="learn"
        lessonCount={currentLesson}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-col mx-auto h-full w-full overflow-y-auto relative">
          <LearnMessages
            messages={messages}
            lastMessageRef={lastMessageRef}
            onVideoQuery={handleVideoQuery}
          />

          {/* Fixed position for the input at the bottom - ABSOLUTE CENTER */}
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              left: "51%",
              transform: "translateX(-50%)",
              width: "95%",
              maxWidth: "500px",
            }}
            className="z-50 flex flex-col gap-4"
          >
            {/* Continue Learning button - original styling */}
            <button
              className="w-full py-3 rounded-lg bg-accent/40 hover:bg-accent/60 transition-all shadow-sm"
              onClick={handleNextLesson}
              disabled={isGenerating}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium">Continue Learning</span>
                <span className="text-sm text-muted-foreground mt-1">
                  {isGenerating
                    ? "Loading next topic..."
                    : `Lesson ${
                        currentLesson + 1
                      }: What's next after ${lessonSequence[
                        lessonSequence.length - 1
                      ]?.substring(0, 30)}...`}
                </span>
              </div>
            </button>

            {/* Lesson progress indicator */}
            <div className="flex justify-center mb-2">
              <div className="flex space-x-1">
                {[...Array(Math.min(8, currentLesson + 3))].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < currentLesson ? "bg-primary" : "bg-accent/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
