"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, PlayCircle, Save, Share } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { generateUUID } from "@/lib/utils";

export default function CodePlayground() {
  const [language, setLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"output" | "assistant">("output");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // AI integration with Google AI - Create separate instances for execution and assistance
  const executionChat = useChat({
    id: `execution-${generateUUID()}`,
    api: "/api/code-assistant",
    onFinish: (message) => {
      console.log("Execution response received:", message);
      if (activeTab === "output") {
        setOutput(message.content);
        setIsRunning(false);
      }
    },
  });

  const assistantChat = useChat({
    id: `assistant-${generateUUID()}`,
    api: "/api/code-assistant",
  });

  const languageOptions = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "ruby", label: "Ruby" },
  ];

  // Handle code execution using AI
  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("Please write some code first before running.");
      return;
    }

    setIsRunning(true);
    setOutput("Running code...");
    setActiveTab("output");

    // Prepare a prompt that asks for the code output
    const prompt = `What would be the output of running this ${language} code? Please only show the exact output as it would appear in a terminal or console, without explanations or formatting.

\`\`\`${language}
${code}
\`\`\``;

    // Send to AI using execution chat
    executionChat.append({
      role: "user",
      content: prompt,
    });
  };

  // Ask AI for help with the current code
  const askAI = () => {
    if (!code.trim()) {
      setOutput("Please write some code first before asking for help.");
      return;
    }

    setActiveTab("assistant");

    // Only append if we don't already have messages to avoid duplicate requests
    if (assistantChat.messages.length === 0) {
      // Prepare a prompt that includes the code and language
      const prompt = `I'm working with ${language} code. Can you help me understand, improve, or fix any issues with this code?

\`\`\`${language}
${code}
\`\`\``;

      // Send to AI using assistant chat
      assistantChat.append({
        role: "user",
        content: prompt,
      });
    }
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.value);
      const currentOutput = output;
      setOutput("Code copied to clipboard!");
      setTimeout(() => {
        setOutput(currentOutput);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with language selector */}
      <div className="bg-card border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">Code Playground</h2>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="size-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <Save className="size-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share className="size-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleRunCode}
            disabled={isRunning || !code || executionChat.isLoading}
            size="sm"
          >
            <PlayCircle className="size-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      {/* Main content: Code editor and output */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="w-1/2 border-r overflow-hidden flex flex-col">
          <div className="p-2 bg-muted text-sm font-medium">Editor</div>
          <textarea
            ref={editorRef}
            className="flex-1 p-4 font-mono text-sm w-full resize-none outline-none bg-background"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Write your ${language} code here`}
            spellCheck="false"
          />
        </div>

        {/* Output & AI Assistant */}
        <div className="w-1/2 overflow-hidden flex flex-col">
          <div className="flex border-b">
            <button
              className={`p-2 text-sm font-medium flex-1 border-r ${
                activeTab === "output" ? "bg-muted" : "bg-background"
              }`}
              onClick={() => setActiveTab("output")}
            >
              Output
            </button>
            <button
              className={`p-2 text-sm font-medium flex-1 ${
                activeTab === "assistant" ? "bg-muted" : "bg-background"
              }`}
              onClick={askAI}
            >
              AI Assistant
            </button>
          </div>

          <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-card">
            {activeTab === "output" ? (
              /* Output content */
              <div>
                {executionChat.isLoading ? (
                  <div className="animate-pulse text-muted-foreground">
                    Executing code...
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                )}
              </div>
            ) : (
              /* AI assistant content */
              <div className="whitespace-pre-wrap">
                {assistantChat.isLoading ? (
                  <div className="animate-pulse text-muted-foreground">
                    Analyzing your code...
                  </div>
                ) : (
                  assistantChat.messages
                    .filter((message) => message.role === "assistant")
                    .map((message, index) => (
                      <div key={index} className="mb-4">
                        <div className="font-medium mb-1">AI Assistant:</div>
                        <div>{message.content}</div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
