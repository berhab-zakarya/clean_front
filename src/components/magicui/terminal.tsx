"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSpanProps) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: delay / 1000 }}
    className={cn("grid text-base font-mono tracking-tight", className)}
    {...props}
  >
    {children}
  </motion.div>
);

interface TypingAnimationProps extends MotionProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string. Received:");
  }

  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [children, duration, started]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("text-base font-mono tracking-tight", className)}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  );
};

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminal = ({ children, className }: TerminalProps) => {
  return (
    <div
      className={cn(
        "z-0 h-full max-h-full w-full max-w-full rounded-xl border border-white/10 bg-[#0f172a] shadow-2xl",
        className,
      )}
    >
      {/* Terminal Header */}
      <div className="flex flex-col gap-y-2 border-b border-white/10 bg-[#1e293b] p-4 rounded-t-xl">
        <div className="flex flex-row gap-x-2">
          <div className="h-3 w-3 rounded-full bg-[#ef4444] shadow-lg shadow-red-500/20"></div>
          <div className="h-3 w-3 rounded-full bg-[#f59e0b] shadow-lg shadow-yellow-500/20"></div>
          <div className="h-3 w-3 rounded-full bg-[#10b981] shadow-lg shadow-green-500/20"></div>
        </div>
        <div className="mt-2 text-xs text-white/60 font-mono">
          Terminal - Ready
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <pre className="overflow-auto">
          <code className="grid gap-y-2 font-mono text-sm">
            {children}
          </code>
        </pre>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-white/10 bg-[#1e293b] p-2 rounded-b-xl">
        <div className="text-xs text-white/40 font-mono px-2">
          Press Ctrl+C to exit
        </div>
      </div>
    </div>
  );
};
