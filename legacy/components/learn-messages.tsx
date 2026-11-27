"use client";

import { Message } from "@ai-sdk/react";
import { memo, useState, useRef, useCallback, useEffect } from "react";
import { ExternalLink, Link, Youtube } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseCodeBlocksFromMessage } from "@/app/(chat)/parse-code-blocks";
import CodeSandbox from "@/app/(chat)/code-sandbox";
import YouTubeShorts from "@/app/(chat)/youtube-shorts";
import { Button } from "@/components/ui/button";

export default memo(LearnMessages);

function LearnMessages({
  messages,
  lastMessageRef,
  onVideoQuery,
}: {
  messages: Message[];
  lastMessageRef: React.RefObject<HTMLDivElement | null>;
  onVideoQuery?: (query: string) => void;
}) {
  // Track which messages have videos showing
  const [activeVideoMessages, setActiveVideoMessages] = useState<Set<string>>(
    new Set()
  );

  // Create refs for videos to scroll to
  const videoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Updated toggleVideoDisplay function with improved scrolling
  const toggleVideoDisplay = useCallback(
    (messageId: string, videoQuery: string) => {
      const newActiveVideoMessages = new Set(activeVideoMessages);

      if (newActiveVideoMessages.has(messageId)) {
        newActiveVideoMessages.delete(messageId);
      } else {
        newActiveVideoMessages.add(messageId);

        // Call the onVideoQuery callback if provided
        if (onVideoQuery) {
          onVideoQuery(videoQuery);
        }

        // Increase the delay to give more time for the video to render
        // and use a more gradual scrolling behavior
        setTimeout(() => {
          const videoElement = videoRefs.current[messageId];
          if (videoElement) {
            // Scroll to position video in center of viewport with smoother behavior
            const rect = videoElement.getBoundingClientRect();
            const scrollTop =
              window.pageYOffset || document.documentElement.scrollTop;
            const targetY =
              rect.top + scrollTop - window.innerHeight / 2 + rect.height / 2;

            window.scrollTo({
              top: targetY,
              behavior: "smooth",
            });
          }
        }, 300); // Increased from 100ms to 300ms for better rendering time
      }

      setActiveVideoMessages(newActiveVideoMessages);
    },
    [activeVideoMessages, onVideoQuery]
  );

  // Generate a video query string from message content and code blocks
  const generateVideoQuery = useCallback(
    (message: Message, codeBlocks: any[]) => {
      // Start with the main question from first user message
      let baseQuery = messages[0].content || "";

      // If we have code blocks, add the language and some keywords from code
      if (codeBlocks.length > 0) {
        const codeBlock = codeBlocks[0];
        const language = codeBlock.language || "";

        // Try to extract key concepts from the code
        let codeKeywords = "";

        if (codeBlock.code) {
          // Extract main function names or variables
          const functionMatches = codeBlock.code.match(/def\s+(\w+)/);
          const classMatches = codeBlock.code.match(/class\s+(\w+)/);
          const varMatches = codeBlock.code.match(/(\w+)\s*=/);

          if (functionMatches && functionMatches[1]) {
            codeKeywords += functionMatches[1] + " function ";
          } else if (classMatches && classMatches[1]) {
            codeKeywords += classMatches[1] + " class ";
          } else if (varMatches && varMatches[1]) {
            codeKeywords += varMatches[1] + " variable ";
          }
        }

        // Add language info to the query
        baseQuery = `${language} ${codeKeywords} ${baseQuery}`;
      }

      // For non-code messages, extract key concepts from message content
      else if (message.role === "assistant" && message.content) {
        // Look for headers in markdown content (usually topic indicators)
        const headingMatches = message.content.match(/##\s+([^\n]+)/);
        if (headingMatches && headingMatches[1]) {
          baseQuery = headingMatches[1] + " " + baseQuery;
        }

        // Or grab the first sentence which often has the main concept
        else {
          const firstSentence = message.content.split(".")[0];
          if (firstSentence && firstSentence.length < 100) {
            baseQuery = firstSentence + " " + baseQuery;
          }
        }
      }

      // Generate a unique query ID for each message to ensure different videos
      return `${baseQuery} lesson-${message.id.substring(0, 8)}`;
    },
    [messages]
  );

  return (
    <div className="w-full max-w-3xl h-full mx-auto tracking-wide space-y-8 p-3 sm:p-4 pb-32">
      {messages.map((message, index) => {
        // Parse message content for code blocks
        let messageContent = "";
        let codeBlocks: Array<{
          language: string;
          code: string;
        }> = [];

        if (message.parts && message.parts.length > 0) {
          const textParts = message.parts.filter(
            (part) => part.type === "text"
          );
          if (textParts.length > 0 && textParts[0].type === "text") {
            const { codeBlocks: extractedBlocks, cleanedMessage } =
              parseCodeBlocksFromMessage(textParts[0].text);
            messageContent = cleanedMessage;
            codeBlocks = extractedBlocks;
          }
        }

        const isVideoActive = activeVideoMessages.has(message.id);
        const showVideoButton = message.role === "assistant" && index > 0;

        // Generate unique video query for this message
        const videoQuery = generateVideoQuery(message, codeBlocks);

        return (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
            className={`bg-card p-4 sm:p-6 rounded-xl border shadow-sm pb-12 ${
              index === messages.length - 1 ? "min-h-[calc(100vh-280px)]" : ""
            }`}
          >
            <div className="whitespace-pre-wrap w-full">
              <div className="font-medium mb-2 text-lg border-b pb-2">
                {message.role === "user" ? (
                  <span className="text-accent">Question:</span>
                ) : (
                  <span className="text-primary">
                    Lesson {Math.floor(index / 2) + 1}:
                  </span>
                )}
              </div>

              {/* Text Content */}
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none tracking-normal leading-tight space-y-2 [&>*]:my-1 [&>h1]:mt-4 [&>h2]:mt-3 [&>h3]:mt-2">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.role === "user" ? message.content : messageContent}
                </Markdown>
              </div>

              {/* Code Blocks - Limited to 1-2 examples */}
              {message.role === "assistant" &&
                codeBlocks
                  .slice(0, 2)
                  .map((codeBlock, idx) => (
                    <CodeSandbox
                      key={`${message.id}-code-${idx}`}
                      code={codeBlock.code}
                      language={codeBlock.language}
                    />
                  ))}

              {/* YouTube Video Button */}
              {showVideoButton && (
                <div
                  className={`mt-6 flex justify-end ${
                    !isVideoActive ? "pb-32" : ""
                  }`}
                >
                  <Button
                    variant={isVideoActive ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => toggleVideoDisplay(message.id, videoQuery)}
                  >
                    <Youtube size={16} />
                    {isVideoActive
                      ? "Hide Video Example"
                      : "Show Video Example"}
                  </Button>
                </div>
              )}

              {/* YouTube Video Content - Only shown when active */}
              {showVideoButton && (
                <div
                  className={`${isVideoActive ? "mt-6 mb-6" : "mb-6 min-h-0"}`}
                >
                  {isVideoActive && (
                    <div
                      ref={(el) => {
                        if (el) {
                          videoRefs.current[message.id] = el;
                        }
                      }}
                    >
                      <YouTubeShorts topicQuery={videoQuery} />
                    </div>
                  )}
                </div>
              )}

              {/* Sources Section */}
              {message.parts?.some((part) => part.type === "source") && (
                <div className="mb-4 mt-6">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Link size={16} />
                    <span>Sources</span>
                    <span className="text-muted-foreground bg-muted rounded-md px-1">
                      {
                        message.parts.filter((part) => part.type === "source")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-thin">
                    {message.parts
                      ?.filter((part) => part.type === "source")
                      .map((part) => (
                        <a
                          key={`source-${part.source.id}`}
                          href={part.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 border rounded-md p-2 min-w-[200px] max-w-[280px] bg-background hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-xs font-medium text-primary truncate max-w-[85%] group flex items-center gap-1">
                              <span className="truncate">
                                {part.source.title ??
                                  new URL(part.source.url).hostname}
                              </span>
                              <ExternalLink
                                size={12}
                                className="flex-shrink-0 opacity-70"
                              />
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {new URL(part.source.url).hostname}
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
