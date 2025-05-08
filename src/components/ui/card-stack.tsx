"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Card = {
  id: string;
  content: React.ReactNode;
  name?: string;
  designation?: string;
};

export const CardStack = ({
  items,
  current,
  setCurrent,
}: {
  items: Card[];
  current: number;
  setCurrent: (index: number) => void;
}) => {
  return (
    <div className="relative h-[800px] w-[1235px] mx-auto">
      {items.map((card, index) => {
        const isCurrentCard = index === current;
        const isPreviousCard = index === current - 1;
        const isNextCard = index === current + 1;

        return (
          <motion.div
            key={card.id}
            className="absolute top-0 left-0 right-0 bg-transparent rounded-3xl"
            initial={false}
            animate={{
              scale: isCurrentCard ? 1 : isPreviousCard ? 0.95 : isNextCard ? 0.95 : 0.9,
              opacity: isCurrentCard ? 1 : isPreviousCard ? 0.6 : isNextCard ? 0.6 : 0,
              y: isCurrentCard ? 0 : isPreviousCard ? -20 : isNextCard ? 20 : 0,
              zIndex: isCurrentCard ? 3 : isPreviousCard ? 2 : isNextCard ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {card.content}
          </motion.div>
        );
      })}
    </div>
  );
};
