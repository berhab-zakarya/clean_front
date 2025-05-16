"use client";

import { useState } from "react";
import MergedComponent from "@/components/dashboard/StoreSetupGuide/MergedComponent";
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/magicui/terminal";
import Button from "@/components/common/Button";

export default function TestPage() {
  const [terminalLines, setTerminalLines] = useState<
    {
      type: "typing" | "span";
      text: string;
      className?: string;
      delay?: number;
    }[]
  >([]);

  // Add a new line to the terminal log
  const addTerminalLine = (line: {
    type: "typing" | "span";
    text: string;
    className?: string;
    delay?: number;
  }) => {
    setTerminalLines((prev) => [...prev, line]);
  };

  const simulateDeployment = () => {
    setTerminalLines([]); // Reset terminal

    // Simulate deployment process
    setTimeout(() => {
      addTerminalLine({
        type: "typing",
        text: "> Starting deployment process...",
        className: "text-[#00ff9d]",
      });

      setTimeout(() => {
        addTerminalLine({
          type: "span",
          text: "✓ Initializing project structure",
          className: "text-[#00ffff]",
        });

        setTimeout(() => {
          addTerminalLine({
            type: "span",
            text: "✓ Installing dependencies",
            className: "text-[#00ffff]",
          });

          setTimeout(() => {
            addTerminalLine({
              type: "span",
              text: "✓ Building application",
              className: "text-[#00ffff]",
            });

            setTimeout(() => {
              addTerminalLine({
                type: "span",
                text: "✓ Deploying to server",
                className: "text-[#00ffff]",
              });

              setTimeout(() => {
                addTerminalLine({
                  type: "span",
                  text: "✓ Deployment completed successfully!",
                  className: "text-[#00ff9d] font-semibold",
                });
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen">
      <MergedComponent
        content={
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">Terminal Test Page</h1>
              <p className="text-gray-300 text-center mb-8">
                This is a test page to demonstrate the terminal functionality
              </p>
              <Button
                onClick={simulateDeployment}
                className="bg-[#00ff9d] text-black hover:bg-[#00cc7d] transition-colors"
              >
                Simulate Deployment
              </Button>
            </div>

            {/* Terminal output */}
            {terminalLines.length > 0 && (
              <div className="w-full max-h-[60vh] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 bg-black/50 rounded-xl backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
                  <Terminal className="text-white bg-[#0a0a0a] rounded-lg shadow-xl border border-gray-800">
                    {terminalLines.map((line, idx) =>
                      line.type === "typing" ? (
                        <TypingAnimation
                          key={idx}
                          className={`${
                            line.className || "text-[#00ff9d]"
                          } text-base font-mono`}
                          delay={idx * 200}
                        >
                          {line.text}
                        </TypingAnimation>
                      ) : (
                        <AnimatedSpan
                          key={idx}
                          className={`${
                            line.className || "text-[#00ffff]"
                          } text-base font-mono`}
                          delay={idx * 200 + 100}
                        >
                          <span>{line.text}</span>
                        </AnimatedSpan>
                      )
                    )}
                  </Terminal>
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
