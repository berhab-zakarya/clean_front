"use client"

import { useState, useEffect, useRef } from "react"

interface VSCodeEditorProps {
  activeFilePath: string | null
  fileContent: string | null
  onContentChange: (content: string) => void
}

type TokenType = 
  | 'keyword'   // e.g. import, export, const
  | 'type'      // e.g. interface, type
  | 'string'    // e.g. "text" or 'text'
  | 'comment'   // e.g. // comments or /* comments */
  | 'jsx'       // JSX tags
  | 'function'  // Function names
  | 'variable'  // Variable names
  | 'property'  // Object properties
  | 'number'    // Numeric literals
  | 'operator'  // Operators like =, +=, etc.
  | 'punctuation' // Brackets, commas, etc.
  | 'default'   // Default text

interface Token {
  type: TokenType
  content: string
}

function tokenizeCode(code: string): Token[] {
  const patterns = [
    { type: 'comment', regex: /^\/\/.*|^\/\*[\s\S]*?\*\// },
    { type: 'string', regex: /^(['"`])(?:\\.|(?!\1)[^\\\n])*\1/ },
    { type: 'keyword', regex: /^(import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|default|class|extends|implements|interface|type|enum|namespace|public|private|protected|readonly|static|async|await|try|catch|finally|throw|new|this|super|typeof|instanceof|void|null|undefined|true|false|as|of)(?!\w)/ },
    { type: 'type', regex: /^(string|number|boolean|any|unknown|never|object|symbol|bigint|null|undefined|void|React)(?!\w)/ },
    { type: 'jsx', regex: /^<[a-zA-Z][a-zA-Z0-9]*|^<\/[a-zA-Z][a-zA-Z0-9]*|^>|^\/>/},
    { type: 'function', regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/ },
    { type: 'property', regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*:)/ },
    { type: 'variable', regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
    { type: 'number', regex: /^[0-9]+(?:\.[0-9]+)?/ },
    { type: 'operator', regex: /^(=>|===|!==|==|!=|>=|<=|>|<|\+\+|--|\|\||&&|\+|-|\*|\/|=|\?|\:|\.|{|}|\(|\)|\[|\])/ },
    { type: 'punctuation', regex: /^[{}()\[\],;:]/ },
    { type: 'default', regex: /^\s+|^./ }
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
    case 'keyword':
      return 'text-purple-400'; // purple for keywords
    case 'type':
      return 'text-blue-400';   // blue for types
    case 'string':
      return 'text-green-400';  // green for strings
    case 'comment':
      return 'text-gray-500';   // gray for comments
    case 'jsx':
      return 'text-yellow-400'; // yellow for JSX tags
    case 'function':
      return 'text-yellow-300'; // yellow for functions
    case 'variable':
      return 'text-white';      // white for variables
    case 'property':
      return 'text-blue-300';   // light blue for properties
    case 'number':
      return 'text-orange-400'; // orange for numbers
    case 'operator':
      return 'text-red-400';    // red for operators
    case 'punctuation':
      return 'text-gray-400';   // light gray for punctuation
    default:
      return 'text-gray-200';   // default text color
  }
}

function HighlightedCode({ code }: { code: string }) {
  // Split code into lines with preserved indentation
  const lines = code.split('\n');
  
  return (
    <div className="whitespace-pre font-mono text-sm">
      {lines.map((line, lineIndex) => {
        const tokens = tokenizeCode(line);
        return (
          <div key={lineIndex} className="leading-6">
            {tokens.map((token, tokenIndex) => (
              <span
                key={tokenIndex}
                className={`${getTokenColor(token.type)}`}
              >
                {token.content}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function VSCodeEditor({ activeFilePath, fileContent, onContentChange }: VSCodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  
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
    
    const lastNewLineIndex = textBeforeCursor.lastIndexOf('\n');
    const column = lastNewLineIndex >= 0 ? cursorPos - lastNewLineIndex - 1 : cursorPos;
    
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
    
    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onContentChange(newContent);
    updateCursorPosition();
  };

  // Handle cursor movement
  const handleSelect = () => {
    updateCursorPosition();
  };

  // Handle tab key and other keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
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
        const lines = selectedText.split('\n');
        const indentedText = lines.map(line => "  " + line).join('\n');
        
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
    } else if (e.key === 'Enter') {
      // Auto-indentation on Enter
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      
      if (start > 0) {
        const text = textarea.value;
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const currentLine = text.substring(lineStart, start);
        const indent = currentLine.match(/^\s*/)?.[0] || '';
        
        // Auto indent after brackets
        let extraIndent = '';
        if (currentLine.trim().endsWith('{') || 
            currentLine.trim().endsWith('[') || 
            currentLine.trim().endsWith('(')) {
          extraIndent = '  ';
        }
        
        if (indent || extraIndent) {
          e.preventDefault();
          const newContent = 
            text.substring(0, start) + 
            '\n' + indent + extraIndent + 
            text.substring(start);
          
          onContentChange(newContent);
          
          // Move cursor after the indentation
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
            updateCursorPosition();
          }, 0);
        }
      }
    } else if (e.key === '}' || e.key === ']' || e.key === ')') {
      // Auto outdent for closing brackets
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      
      if (start > 0) {
        const text = textarea.value;
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const currentLine = text.substring(lineStart, start);
        
        // If the line only contains whitespace, reduce indentation
        if (/^\s+$/.test(currentLine)) {
          const newIndent = currentLine.substring(0, Math.max(0, currentLine.length - 2));
          e.preventDefault();
          
          const newContent = 
            text.substring(0, lineStart) + 
            newIndent + e.key + 
            text.substring(start);
          
          onContentChange(newContent);
          
          // Move cursor after the closing bracket
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = lineStart + newIndent.length + 1;
            updateCursorPosition();
          }, 0);
        }
      }
    }
    
    // Basic auto-close for brackets and quotes
    const autoCloseMap: Record<string, string> = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'",
      '`': '`'
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
            e.key + selectedText + autoCloseMap[e.key] + 
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
            e.key + autoCloseMap[e.key] + 
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
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
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
  const fileExtension = activeFilePath ? activeFilePath.split('.').pop()?.toLowerCase() : null;
  const language = fileExtension === 'ts' || fileExtension === 'tsx' ? 'TypeScript' : 
                  fileExtension === 'js' || fileExtension === 'jsx' ? 'JavaScript' : 
                  fileExtension === 'html' ? 'HTML' : 
                  fileExtension === 'css' ? 'CSS' : 
                  fileExtension === 'json' ? 'JSON' : 'Plain Text';

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-gray-950 text-white border border-gray-800 rounded overflow-hidden"
      onClick={handleContainerClick}
    >
      {/* Tab bar */}
      <div className="flex bg-gray-900 border-b border-gray-800">
        {activeFilePath && (
          <div className="flex items-center px-4 py-2 bg-gray-800 border-r border-gray-700">
            <span className="text-sm">{activeFilePath.split("/").pop()}</span>
          </div>
        )}
      </div>
      
      {/* Editor */}
      <div 
        ref={editorContainerRef}
        className="flex-1 flex flex-col overflow-hidden relative"
      >
        {activeFilePath ? (
          <div className="flex h-full relative overflow-hidden">
            {/* Line numbers */}
            <div className="py-2 px-2 text-right text-gray-500 bg-gray-900 select-none min-w-10 overflow-hidden">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6 text-sm">
                  {num}
                </div>
              ))}
            </div>
            
            {/* Code editor with syntax highlighting */}
            <div className="relative flex-grow overflow-auto">
              {/* Highlighted code layer (non-interactive) */}
              <div 
                ref={editorRef}
                className="absolute inset-0 py-2 px-4 overflow-auto pointer-events-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                style={{ opacity: isFocused ? 0.3 : 1 }}
              >
                <HighlightedCode code={fileContent || ""} />
              </div>
              
              {/* Textarea for editing */}
              <textarea
                ref={textareaRef}
                value={fileContent || ""}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSelect={handleSelect}
                onClick={handleSelect}
                className={`absolute inset-0 py-2 px-4 outline-none overflow-auto resize-none font-mono text-sm leading-6
                  w-full h-full whitespace-pre bg-opacity-50 scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 ${
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
      
      {/* Status bar */}
      <div className="flex justify-between items-center text-xs bg-gray-800 border-t border-gray-700 px-3 py-1">
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