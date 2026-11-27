"use client";

import { useState, useEffect } from "react";

interface YouTubeShortsProps {
  topicQuery: string;
}

export default function YouTubeShorts({ topicQuery }: YouTubeShortsProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQueryUsed, setSearchQueryUsed] = useState<string>("");
  const [querySignature, setQuerySignature] = useState<string>("");

  // Get API key from environment variable
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";

  // Generate a unique signature for each query to detect changes
  useEffect(() => {
    const newSignature = topicQuery.trim().toLowerCase();
    if (newSignature !== querySignature) {
      setQuerySignature(newSignature);
      setVideoId(null);
      setVideoTitle("");
      setSearchQueryUsed("");
      setError(null);
    }
  }, [topicQuery, querySignature]);

  useEffect(() => {
    // Skip if no topic, if we already have a video, or if API key is missing
    if (!topicQuery || videoId || !API_KEY) {
      if (!API_KEY && !error) {
        setError(
          "YouTube API key is missing. Please set NEXT_PUBLIC_YOUTUBE_API_KEY in your environment variables."
        );
      }
      return;
    }

    const searchForShorts = async () => {
      // Extract key learning concepts from the topic
      let searchTerms = topicQuery.trim();

      // Find programming language or technical topic mentions
      const techKeywords = [
        "python",
        "javascript",
        "java",
        "c++",
        "c#",
        "ruby",
        "php",
        "typescript",
        "html",
        "css",
        "sql",
        "database",
        "algorithm",
        "react",
        "angular",
        "vue",
        "node.js",
        "express",
        "django",
        "flask",
        "spring",
        "programming",
        "coding",
        "development",
      ];

      // Find the first technical keyword mentioned
      const foundTech = techKeywords.find((keyword) =>
        topicQuery.toLowerCase().includes(keyword.toLowerCase())
      );

      // If we found a tech topic, let's make it more specific
      if (foundTech) {
        // Extract key concepts using some basic rules
        const conceptPatterns = [
          /(\w+)\s+function/i,
          /(\w+)\s+loop/i,
          /(\w+)\s+class/i,
          /(\w+)\s+variable/i,
          /(\w+)\s+method/i,
          /(\w+)\s+statement/i,
          /(\w+)\s+operator/i,
          /(\w+)\s+array/i,
          /(\w+)\s+object/i,
          /(\w+)\s+syntax/i,
        ];

        for (const pattern of conceptPatterns) {
          const match = topicQuery.match(pattern);
          if (match && match[1]) {
            searchTerms = `${match[1]} ${foundTech} tutorial shorts`;
            break;
          }
        }

        // If no specific concept was found, make a general query
        if (searchTerms === topicQuery.trim()) {
          // Check for code snippets by looking for code markers
          if (
            topicQuery.includes("```") ||
            topicQuery.includes("print(") ||
            topicQuery.includes("console.log") ||
            topicQuery.includes("function ")
          ) {
            searchTerms = `${foundTech} code example shorts`;
          } else {
            searchTerms = `learn ${foundTech} basics shorts`;
          }
        }
      } else {
        // For non-technical topics, add "shorts" and "tutorial" or "explanation"
        if (searchTerms.length > 50) {
          // Extract first 3-5 words if topic is long
          searchTerms = searchTerms.split(" ").slice(0, 5).join(" ");
        }
        searchTerms += " explanation shorts";
      }

      // Set our final search query
      const exactSearchQuery = searchTerms;
      setSearchQueryUsed(exactSearchQuery);

      setIsLoading(true);
      setError(null);

      try {
        console.log("Searching YouTube for:", exactSearchQuery);

        // Search for YouTube videos related to the topic
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
            exactSearchQuery
          )}&type=video&safeSearch=strict&videoDuration=short&key=${API_KEY}`
        );

        if (!searchResponse.ok) {
          throw new Error("Failed to fetch search results");
        }

        const searchData = await searchResponse.json();
        console.log("Search results:", searchData);

        // Check if we got any results
        if (searchData.items && searchData.items.length > 0) {
          // Get the first result
          const selectedVideo = searchData.items[0];
          setVideoId(selectedVideo.id.videoId);
          setVideoTitle(selectedVideo.snippet.title);
          console.log("Selected video:", selectedVideo.snippet.title);
        } else {
          throw new Error("No videos found for this topic");
        }
      } catch (error) {
        console.error("Error searching for videos:", error);
        setError("Couldn't find a relevant video for this topic");
      } finally {
        setIsLoading(false);
      }
    };

    searchForShorts();
  }, [topicQuery, videoId, querySignature]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center my-4 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted-foreground">
          Finding a relevant video for: <strong>{searchQueryUsed}</strong>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center my-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
        <p className="text-amber-800 text-sm">{error}</p>
        <p className="text-amber-700 text-xs mt-1">
          Search query used: <strong>{searchQueryUsed}</strong>
        </p>
      </div>
    );
  }

  if (!videoId) return null;

  return (
    <div className="flex flex-col items-center my-6 mb-35">
      <div className="rounded-xl overflow-hidden shadow-lg border border-border max-w-[350px] w-full relative">
        {/* Set a fixed aspect ratio container */}
        <div className="relative w-full pb-[177.8%]">
          {" "}
          {/* 16:9 aspect ratio */}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            title="YouTube Shorts"
          ></iframe>
        </div>
      </div>
      <div className="w-full max-w-[350px] px-2">
        <p className="text-xs text-center text-muted-foreground mt-2 truncate">
          {videoTitle || "Learning Video"}
        </p>
      </div>
    </div>
  );
}
