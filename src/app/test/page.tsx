"use client";

import { useState } from "react";
import MergedComponent from "@/components/dashboard/StoreSetupGuide/MergedComponent";
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/magicui/terminal";


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
            <button
              onClick={simulateDeployment}
              className="mb-4 px-4 py-2 bg-[#00ff9d] text-black rounded-md hover:bg-[#00cc7d] transition-colors"
            >
              Start Deployment
            </button>

            {/* Terminal output */}
            {terminalLines.length > 0 && (
              <div className="w-full max-h-[60vh] flex flex-col">
                <div className="flex-1 overflow-y-auto ">
                  <Terminal className="text-white">
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
