"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, BookOpen, Rocket } from "lucide-react";
import { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default memo(ChatInput);

const placeholderPrompts = {
  explore: [
    "The newest LLM models",
    "Explain quantum computing",
    "Creative writing prompts about space",
    "Best practices for React development",
    "Summarize the latest AI research papers",
  ],
  learn: [
    "Learn how to code in Python",
    "Teach me about quantum physics",
    "Help me understand machine learning",
    "I want to learn about world history",
    "Guide me through writing a novel",
  ],
};

function ChatInput({
  onboarding = false,
  submitUserMessage,
  input,
  handleInputChange,
  mode = "explore",
  setMode,
}: {
  onboarding: boolean;
  submitUserMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mode?: "explore" | "learn";
  setMode?: (mode: "explore" | "learn") => void;
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    placeholderPrompts[mode][0]
  );
  const [isFading, setIsFading] = useState(false);

  // Handle rotating placeholders in explore mode
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let fadeTimeoutId: NodeJS.Timeout | undefined;

    if (onboarding) {
      intervalId = setInterval(() => {
        setIsFading(true);
        fadeTimeoutId = setTimeout(() => {
          setPlaceholderIndex(
            (prevIndex) => (prevIndex + 1) % placeholderPrompts[mode].length
          );
          setIsFading(false);
        }, 500);
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
    };
  }, [onboarding, mode]);

  useEffect(() => {
    if (onboarding && !isFading) {
      setCurrentPlaceholder(placeholderPrompts[mode][placeholderIndex]);
    }
  }, [placeholderIndex, onboarding, isFading, mode]);

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const formEvent = e as unknown as React.FormEvent<HTMLFormElement>;
      submitUserMessage(formEvent);
    }
  };

  if (onboarding) {
    return (
      <div className="flex flex-col flex-1 max-w-7xl w-full gap-8 items-center mx-auto mt-4 pt-12 px-4 xs:pl-8 xs:pr-14 md:pt-[25vh] lg:mt-6 2xl:pr-20 max-sm:!px-1">
        <div className="flex w-full flex-col items-start mx-auto gap-3 max-md:pt-4 max-w-2xl pl-3 mb-4">
          <h1 className="text-5xl font-medium tracking-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            {mode === "explore" ? "Hello," : "Hey,"}
          </h1>
          <p className="text-4xl font-medium tracking-tight">
            {mode === "explore"
              ? "What do you want to explore?"
              : "What do you want to learn?"}
          </p>
        </div>

        <div className="w-full max-w-2xl px-2">
          {mode === "explore" ? (
            <form onSubmit={submitUserMessage}>
              <p className="text-sm text-muted-foreground mb-3 pl-1">
                Explore topics using search grounded AI models and
                visualizations
              </p>
              <div className="relative flex flex-col w-full gap-4">
                <div className="relative flex flex-col">
                  {input.length === 0 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-3 left-4 text-muted-foreground pointer-events-none tracking-wide text-sm",
                        "transition-opacity duration-500 ease-in-out",
                        isFading ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {currentPlaceholder}
                    </span>
                  )}
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder=""
                    className="min-h-[120px] sm:min-h-[150px] resize-none rounded-2xl px-4 py-3 shadow-sm font-medium tracking-wide relative bg-transparent caret-primary"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="absolute bottom-0 w-full flex justify-between items-center px-3 sm:px-4 pb-3">
                  <Select>
                    <SelectTrigger className="w-[100px] sm:w-[180px]">
                      <SelectValue placeholder="gemini 2.0 flash" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="gemini-2.0-flash">
                        gemini 2.0 flash
                      </SelectItem>
                      <SelectItem value="gemini-2.0-flash-lite">
                        gemini 2.0 flash-lite
                      </SelectItem>
                      <SelectItem value="gemini-2.5-pro">
                        gemini 2.5 pro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    variant="default"
                    size="icon"
                    className="rounded-lg bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    <ArrowUp className="size-5" />
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={submitUserMessage} className="w-full">
              <p className="text-sm text-muted-foreground mb-3 pl-1">
                Learn new topics using innovative AI to guide you step-by-step
              </p>
              <div className="relative flex flex-col w-full gap-4">
                <div className="flex flex-col">
                  <div className="relative">
                    {input.length === 0 && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute top-3 left-4 text-muted-foreground pointer-events-none tracking-wide text-sm",
                          "transition-opacity duration-500 ease-in-out",
                          isFading ? "opacity-0" : "opacity-100"
                        )}
                      >
                        {currentPlaceholder}
                      </span>
                    )}
                    <Textarea
                      id="learn-topic"
                      value={input}
                      onChange={handleInputChange}
                      placeholder=""
                      className="min-h-[120px] sm:min-h-[150px] resize-none rounded-2xl px-4 py-3 shadow-sm font-medium tracking-wide bg-transparent caret-primary"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
                <div className="absolute bottom-0 w-full flex justify-between items-center px-3 sm:px-4 pb-3">
                  <Select>
                    <SelectTrigger className="w-[100px] sm:w-[180px]">
                      <SelectValue placeholder="gemini 2.0 flash" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="gemini-2.0-flash">
                        gemini 2.0 flash
                      </SelectItem>
                      <SelectItem value="gemini-2.0-flash-lite">
                        gemini 2.0 flash-lite
                      </SelectItem>
                      <SelectItem value="gemini-2.5-pro">
                        gemini 2.5 pro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="submit"
                    variant="default"
                    size="icon"
                    className="rounded-lg bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    <ArrowUp className="size-5" />
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Mode switcher moved below input as bubbles */}
          {setMode && (
            <div className="flex gap-3 mt-4 ml-1">
              <Button
                variant="ghost"
                onClick={() => setMode("explore")}
                className={`rounded-full flex items-center px-4 py-2 ${
                  mode === "explore"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/50 hover:bg-muted/80"
                }`}
                size="sm"
              >
                <Rocket className="size-4 mr-2" />
                Explore
              </Button>
              <Button
                variant="ghost"
                onClick={() => setMode("learn")}
                className={`rounded-full flex items-center px-4 py-2 ${
                  mode === "learn"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/50 hover:bg-muted/80"
                }`}
                size="sm"
              >
                <BookOpen className="size-4 mr-2" />
                Learn
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular chat mode (not onboarding)
  if (mode === "explore") {
    return (
      <form
        onSubmit={submitUserMessage}
        className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-2xl w-[95%] sm:w-full max-w-xl lg:max-w-3xl bg-background/30 backdrop-blur-sm z-50"
      >
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Enter your topic..."
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-none rounded-2xl px-3 sm:px-4 py-3 shadow-sm font-medium tracking-wide"
            />
          </div>
          <div className="absolute bottom-0 w-full flex justify-between items-center px-3 sm:px-4 pb-3">
            <Select>
              <SelectTrigger className="w-[150px] sm:w-[180px]">
                <SelectValue placeholder="gemini 2.0 flash" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="gemini-2.0-flash">
                  gemini 2.0 flash
                </SelectItem>
                <SelectItem value="gemini-2.0-flash-lite">
                  gemini 2.0 flash-lite
                </SelectItem>
                <SelectItem value="gemini-2.5-pro">gemini 2.5 pro</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              variant="default"
              size="icon"
              className="rounded-lg bg-primary hover:bg-primary/90 cursor-pointer"
            >
              <ArrowUp className="size-5" />
            </Button>
          </div>
        </div>
      </form>
    );
  }

  // For learn mode, just return null since we're handling the input in the LearnChat component directly
  return null;
}
