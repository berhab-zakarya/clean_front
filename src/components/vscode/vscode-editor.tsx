"use client";

import { useState, useEffect, useRef } from "react";
import SimpleButton from "../common/SimpleButton";
import { GithubIcon } from "lucide-react";
import { AskAIInput } from "../common/AskAIInput";

interface VSCodeEditorProps {
  activeFilePath: string | null;
  fileContent: string | null;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isModified: boolean;
}

type TokenType =
  | "keyword" // e.g. import, export, const
  | "type" // e.g. interface, type
  | "string" // e.g. "text" or 'text'
  | "comment" // e.g. // comments or /* comments */
  | "jsx" // JSX tags
  | "function" // Function names
  | "variable" // Variable names
  | "property" // Object properties
  | "number" // Numeric literals
  | "operator" // Operators like =, +=, etc.
  | "punctuation" // Brackets, commas, etc.
  | "default"; // Default text

interface Token {
  type: TokenType;
  content: string;
}

function tokenizeCode(code: string): Token[] {
  const patterns = [
    { type: "comment", regex: /^\/\/.*|^\/\*[\s\S]*?\*\// },
    { type: "string", regex: /^(['"`])(?:\\.|(?!\1)[^\\\n])*\1/ },
    {
      type: "keyword",
      regex:
        /^(import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|default|class|extends|implements|interface|type|enum|namespace|public|private|protected|readonly|static|async|await|try|catch|finally|throw|new|this|super|typeof|instanceof|void|null|undefined|true|false|as|of)(?!\w)/,
    },
    {
      type: "type",
      regex:
        /^(string|number|boolean|any|unknown|never|object|symbol|bigint|null|undefined|void|React)(?!\w)/,
    },
    {
      type: "jsx",
      regex: /^<[a-zA-Z][a-zA-Z0-9]*|^<\/[a-zA-Z][a-zA-Z0-9]*|^>|^\/>/,
    },
    { type: "function", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/ },
    { type: "property", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*:)/ },
    { type: "variable", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
    { type: "number", regex: /^[0-9]+(?:\.[0-9]+)?/ },
    {
      type: "operator",
      regex:
        /^(=>|===|!==|==|!=|>=|<=|>|<|\+\+|--|\|\||&&|\+|-|\*|\/|=|\?|\:|\.|{|}|\(|\)|\[|\])/,
    },
    { type: "punctuation", regex: /^[{}()\[\],;:]/ },
    { type: "default", regex: /^\s+|^./ },
  ];

  const tokens: Token[] = [];
  let remaining = code;

  while (remaining) {
    for (const { type, regex } of patterns) {
      const match = remaining.match(regex);
      if (match && match[0]) {
        tokens.push({ type: type as TokenType, content: match[0] });
        remaining = remaining.slice(match[0].length);
        break;
      }
    }
  }

  return tokens;
}

function getTokenColor(type: TokenType): string {
  switch (type) {
    case "keyword":
      return "text-purple-400"; // purple for keywords
    case "type":
      return "text-blue-400"; // blue for types
    case "string":
      return "text-green-400"; // green for strings
    case "comment":
      return "text-gray-500"; // gray for comments
    case "jsx":
      return "text-yellow-400"; // yellow for JSX tags
    case "function":
      return "text-yellow-300"; // yellow for functions
    case "variable":
      return "text-white"; // white for variables
    case "property":
      return "text-blue-300"; // light blue for properties
    case "number":
      return "text-orange-400"; // orange for numbers
    case "operator":
      return "text-red-400"; // red for operators
    case "punctuation":
      return "text-gray-400"; // light gray for punctuation
    default:
      return "text-gray-200"; // default text color
  }
}

function HighlightedCode({ code }: { code: string }) {
  // Split code into lines with preserved indentation
  const lines = code.split("\n");

  return (
    <div className="whitespace-pre font-mono text-sm">
      {lines.map((line, lineIndex) => {
        const tokens = tokenizeCode(line);
        return (
          <div key={lineIndex} className="leading-6">
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={`${getTokenColor(token.type)}`}>
                {token.content}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function VSCodeEditor({
  activeFilePath,
  fileContent,
  onContentChange,
  onSave,
  isModified,
}: VSCodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });

  // Add new state for validation
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Add validation function
  const validateContent = async (content: string): Promise<boolean> => {
    if (!activeFilePath) return true;

    setIsValidating(true);
    setValidationError(null);

    try {
      // Basic syntax validation based on file type
      const fileExtension = activeFilePath.split(".").pop()?.toLowerCase();

      if (fileExtension === "json") {
        try {
          JSON.parse(content);
        } catch (e) {
          setValidationError("Invalid JSON syntax");
          return false;
        }
      }

      // Add more validation rules for other file types here

      return true;
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Validation failed"
      );
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Add local content state
  const [localContent, setLocalContent] = useState<string | null>(null);

  // Update useEffect to sync local content with file content
  useEffect(() => {
    setLocalContent(fileContent);
  }, [fileContent]);

  // Update line numbers when content changes
  useEffect(() => {
    if (!fileContent) {
      setLineNumbers([1]);
      return;
    }
    const lineCount = (fileContent.match(/\n/g) || []).length + 1;
    setLineNumbers(Array.from({ length: lineCount }, (_, i) => i + 1));
  }, [fileContent]);

  // Handle cursor position update
  const updateCursorPosition = () => {
    if (!textareaRef.current || !fileContent) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;

    // Calculate line and column
    const textBeforeCursor = fileContent.substring(0, cursorPos);
    const line = (textBeforeCursor.match(/\n/g) || []).length;

    const lastNewLineIndex = textBeforeCursor.lastIndexOf("\n");
    const column =
      lastNewLineIndex >= 0 ? cursorPos - lastNewLineIndex - 1 : cursorPos;

    setCursorPosition({ line, column });
  };

  // Improved synchronous scrolling between textarea and highlighted code
  useEffect(() => {
    const textarea = textareaRef.current;
    const editor = editorRef.current;

    if (!textarea || !editor) return;

    const handleScroll = () => {
      if (editor) {
        editor.scrollTop = textarea.scrollTop;
        editor.scrollLeft = textarea.scrollLeft;
      }
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  // Modify handleContentChange to not immediately update
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    // Only update local state, don't call onContentChange yet
    setLocalContent(newContent);
    updateCursorPosition();
  };

  // Handle cursor movement
  const handleSelect = () => {
    updateCursorPosition();
  };

  // Handle tab key and other keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start === end) {
        // Insert 2 spaces for tab
        const newContent =
          textarea.value.substring(0, start) +
          "  " +
          textarea.value.substring(end);

        onContentChange(newContent);

        // Move cursor after the inserted tab
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateCursorPosition();
        }, 0);
      } else {
        // Multi-line tab indentation
        const selectedText = textarea.value.substring(start, end);
        const lines = selectedText.split("\n");
        const indentedText = lines.map((line) => "  " + line).join("\n");

        const newContent =
          textarea.value.substring(0, start) +
          indentedText +
          textarea.value.substring(end);

        onContentChange(newContent);

        // Adjust selection to include the new indentation
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start + indentedText.length;
          updateCursorPosition();
        }, 0);
      }
    } else if (e.key === "Enter") {
      // Auto-indentation on Enter
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;

      if (start > 0) {
        const text = textarea.value;
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        const currentLine = text.substring(lineStart, start);
        const indent = currentLine.match(/^\s*/)?.[0] || "";

        // Auto indent after brackets
        let extraIndent = "";
        if (
          currentLine.trim().endsWith("{") ||
          currentLine.trim().endsWith("[") ||
          currentLine.trim().endsWith("(")
        ) {
          extraIndent = "  ";
        }

        if (indent || extraIndent) {
          e.preventDefault();
          const newContent =
            text.substring(0, start) +
            "\n" +
            indent +
            extraIndent +
            text.substring(start);

          onContentChange(newContent);

          // Move cursor after the indentation
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              start + 1 + indent.length + extraIndent.length;
            updateCursorPosition();
          }, 0);
        }
      }
    } else if (e.key === "}" || e.key === "]" || e.key === ")") {
      // Auto outdent for closing brackets
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;

      if (start > 0) {
        const text = textarea.value;
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        const currentLine = text.substring(lineStart, start);

        // If the line only contains whitespace, reduce indentation
        if (/^\s+$/.test(currentLine)) {
          const newIndent = currentLine.substring(
            0,
            Math.max(0, currentLine.length - 2)
          );
          e.preventDefault();

          const newContent =
            text.substring(0, lineStart) +
            newIndent +
            e.key +
            text.substring(start);

          onContentChange(newContent);

          // Move cursor after the closing bracket
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              lineStart + newIndent.length + 1;
            updateCursorPosition();
          }, 0);
        }
      }
    }

    // Basic auto-close for brackets and quotes
    const autoCloseMap: Record<string, string> = {
      "{": "}",
      "[": "]",
      "(": ")",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    if (autoCloseMap[e.key] && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Only auto-close if we have a selection or we're not followed by the same closing character
      const nextChar = textarea.value.charAt(end);
      if (start !== end || nextChar !== autoCloseMap[e.key]) {
        // For selections, wrap the selection
        if (start !== end) {
          const selectedText = textarea.value.substring(start, end);
          e.preventDefault();

          const newContent =
            textarea.value.substring(0, start) +
            e.key +
            selectedText +
            autoCloseMap[e.key] +
            textarea.value.substring(end);

          onContentChange(newContent);

          // Keep the selection between the brackets
          setTimeout(() => {
            textarea.selectionStart = start + 1;
            textarea.selectionEnd = end + 1;
            updateCursorPosition();
          }, 0);
        }
        // For no selection, insert the matching bracket and place cursor between
        else if (!/[a-zA-Z0-9]/.test(nextChar)) {
          e.preventDefault();

          const newContent =
            textarea.value.substring(0, start) +
            e.key +
            autoCloseMap[e.key] +
            textarea.value.substring(end);

          onContentChange(newContent);

          // Place cursor between the brackets
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1;
            updateCursorPosition();
          }, 0);
        }
      }
    }

    // Add keyboard shortcut for saving (Ctrl+S or Command+S)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      // You could add a save indicator or trigger additional save functionality here
    }
  };

  // Focus the editor when clicking on the container
  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Enhanced auto-resize with proper scrollbar handling
  useEffect(() => {
    if (editorContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (textareaRef.current && editorRef.current) {
          // Ensure scrollbars are properly synced after resize
          editorRef.current.scrollTop = textareaRef.current.scrollTop;
          editorRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
      });

      resizeObserver.observe(editorContainerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    // Update cursor position on mount and focus
    updateCursorPosition();

    // Initial focus if there's content
    if (fileContent && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [fileContent]);

  // Extract file extension for syntax highlighting
  const fileExtension = activeFilePath
    ? activeFilePath.split(".").pop()?.toLowerCase()
    : null;
  const language =
    fileExtension === "ts" || fileExtension === "tsx"
      ? "TypeScript"
      : fileExtension === "js" || fileExtension === "jsx"
      ? "JavaScript"
      : fileExtension === "html"
      ? "HTML"
      : fileExtension === "css"
      ? "CSS"
      : fileExtension === "json"
      ? "JSON"
      : "Plain Text";

  // Modify save handler
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!localContent || !activeFilePath) return;

    // Validate content before saving
    const isValid = await validateContent(localContent);
    if (!isValid) {
      return;
    }

    // Only call onContentChange and onSave if validation passes
    onContentChange(localContent);
    onSave();
  };

  const [showInput, setShowInput] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);

  const handleGithubClick = () => {
    setShowInput(true);
    setShowTopbar(false);
  };

  const handleAIInputSubmit = async (value: string) => {
  if (!activeFilePath || !localContent) {
    console.log("No file selected or content available");
    return;
  }

  try {
    // Show loading state (you might want to add a loading state to your component)
    console.log("Processing AI request...");

    // Prepare the prompt with file content
    const prompt = `You are a senior frontend developer with deep experience in React and modern UI/UX best practices.

User request: ${value}

Improve the following code based on the user's request. Keep the core logic and content the same, but enhance:
- Visual structure and responsiveness (if needed).
- Readability and clean code practices.
- Accessibility (if applicable).
- Styling improvements, if relevant.

**Important**: Return only valid, formatted TypeScript React component code. Do NOT change the component name or core logic unless specifically requested. Do NOT wrap in Markdown or add comments. Output the enhanced code only.

Here is the current code:

\`\`\`tsx
${localContent}
\`\`\``;

    // Prepare request body for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    // Make API call to Gemini
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCixCiZ8HRRIIbTdIyHnMmsA00AVE1xN4c',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the generated content
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const enhancedCode = data.candidates[0].content.parts[0].text;
      
      // Update the file content with the enhanced code
      setLocalContent(enhancedCode);
      onContentChange(enhancedCode);
      
      console.log("Code enhanced successfully!");
      
      // Close the AI input after successful enhancement
      setShowInput(false);
      setShowTopbar(true);
      
    } else {
      throw new Error('Invalid response format from API');
    }

  } catch (error) {
    console.error('Error enhancing code:', error);
    
    // You might want to show an error message to the user
    // For example, you could add an error state to your component
    alert(`Failed to enhance code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-gray-950 text-white border border-gray-800 rounded"
      onClick={handleContainerClick}
    >
      {/* Tab bar - Fixed position */}
      {showTopbar && (
        <div className="sticky top-0 z-10 flex-none bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800">
          {activeFilePath && (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-r border-gray-700">
              <div className="flex items-center">
                <span className="text-sm">
                  {activeFilePath.split("/").pop()}
                </span>
                {isModified && (
                  <span className="ml-2 text-yellow-500 text-xs">•</span>
                )}
                {validationError && (
                  <span className="ml-2 text-red-500 text-xs">
                    {validationError}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <SimpleButton
                  title={isValidating ? "Validating..." : "Save"}
                  onClick={handleSave}
                  disabled={!isModified || isValidating}
                  className="h-[40px] group relative px-6 py-3 text-white font-semibold text-sm bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-700 hover:from-emerald-700 hover:via-blue-700 hover:to-indigo-800 disabled:from-gray-500 disabled:via-gray-600 disabled:to-gray-700 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 disabled:shadow-none transform hover:scale-105 active:scale-95 disabled:scale-100 transition-all duration-300 ease-out border border-white/20 disabled:border-gray-400/20 flex items-center gap-3 backdrop-blur-sm disabled:opacity-60 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-skew-x-12 before:-translate-x-full hover:before:translate-x-full disabled:before:translate-x-0 before:transition-transform before:duration-1000 before:ease-out overflow-hidden after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/20 after:via-blue-500/20 after:to-indigo-500/20 after:opacity-0 hover:after:opacity-100 disabled:after:opacity-0 after:transition-opacity after:duration-300 after:blur-sm"
                />

                <SimpleButton
                  title="Ask AI"
                  onClick={handleGithubClick}
                  icon={<GithubIcon className="size-4" />}
                  className="h-[40px]  group relative px-6 py-1 text-white font-semibold text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 ease-out border border-white/20 flex items-center gap-3 backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-skew-x-12 before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000 before:ease-out overflow-hidden after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-blue-500/20 after:via-purple-500/20 after:to-indigo-500/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:blur-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {showInput && (
        <AskAIInput
          onClose={() => {
            setShowInput(false);
            setShowTopbar(true);
          }}
          onSubmit={handleAIInputSubmit}
        />
      )}

      {/* Editor - Scrollable area */}
      <div ref={editorContainerRef} className="flex-1 relative overflow-hidden">
        {activeFilePath ? (
          <div className="absolute inset-0 flex">
            {/* Line numbers - Fixed width */}
            <div className="flex-none py-2 px-2 text-right text-gray-500 bg-gray-900 select-none min-w-10">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6 text-sm">
                  {num}
                </div>
              ))}
            </div>

            {/* Code editor with syntax highlighting - Scrollable */}
            <div className="flex-1 relative">
              {/* Highlighted code layer (non-interactive) */}
              <div
                ref={editorRef}
                className="absolute inset-0 py-2 px-4 pointer-events-none"
                style={{ opacity: isFocused ? 0.3 : 1 }}
              >
                <HighlightedCode code={localContent || ""} />
              </div>

              {/* Textarea for editing */}
              <textarea
                ref={textareaRef}
                value={localContent || ""}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSelect={handleSelect}
                onClick={handleSelect}
                className={`absolute inset-0 py-2 px-4 outline-none resize-none font-mono text-sm leading-6
                  w-full h-full whitespace-pre bg-opacity-50 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 ${
                    isFocused
                      ? "text-white bg-gray-900"
                      : "bg-transparent text-transparent caret-white"
                  }`}
                spellCheck={false}
                aria-label="Code editor"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a file to edit</p>
          </div>
        )}
      </div>

      {/* Status bar - Fixed position */}
      <div className="sticky bottom-0 z-10 flex-none flex justify-between items-center text-xs bg-gray-800 border-t border-gray-700 px-3 py-1">
        <div>
          Ln {cursorPosition.line + 1}, Col {cursorPosition.column + 1}
        </div>
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>{language}</span>
          {!isFocused && <span className="text-gray-500">Read-only</span>}
          {isFocused && <span className="text-green-500">Editing</span>}
        </div>
      </div>
    </div>
  );
}