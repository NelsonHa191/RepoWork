"use client";

// components/demo-video.tsx
// Demo stand-in for app/(chat)/youtube-shorts.tsx. The original searched the
// YouTube Data API (which needs an API key with a small daily quota) for a
// short matching the lesson. The demo embeds a hand-picked video for each
// lesson instead. Embedding needs no key. It also links to a YouTube search
// built with the original component's search-term logic.
// Original: legacy/app/(chat)/youtube-shorts.tsx

import { ExternalLink } from "lucide-react";
import { findCourse } from "@/lib/demo/catalog";

const TECH_KEYWORDS = [
  "python", "javascript", "java", "c++", "c#", "ruby", "php", "typescript",
  "html", "css", "sql", "database", "algorithm", "react", "angular", "vue",
  "node.js", "express", "django", "flask", "spring", "programming", "coding",
  "development",
];

// Same idea as the original searchForShorts(): turn the lesson into a short,
// specific YouTube search.
function buildSearchTerms(topicQuery: string) {
  const query = topicQuery.trim();
  const foundTech = TECH_KEYWORDS.find((k) => query.toLowerCase().includes(k));
  if (foundTech) return `learn ${foundTech} basics shorts`;
  return `${query.split(" ").slice(0, 5).join(" ")} explanation shorts`;
}

export default function DemoVideo({
  courseTopic,
  lessonNumber,
}: {
  courseTopic: string;
  lessonNumber: number;
}) {
  const course = findCourse(courseTopic);
  const video = course?.videos[Math.min(lessonNumber, course.videos.length) - 1];
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    buildSearchTerms(courseTopic)
  )}`;

  return (
    <div className="flex flex-col items-center my-6 gap-2">
      {video ? (
        <>
          <div className="rounded-xl overflow-hidden shadow-lg border border-border w-full max-w-[560px]">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                className="absolute top-0 left-0 w-full h-full"
                title={video.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground max-w-[560px] truncate">
            {video.title} · {video.channel}
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          The demo only has videos picked for its built-in courses.
        </p>
      )}
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        Find more videos on YouTube <ExternalLink size={12} />
      </a>
    </div>
  );
}
