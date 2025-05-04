"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button"; // Import the Button component

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
    setCurrent((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.push(newArray.shift()!);
      return newArray;
    });
    setCurrent((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="relative h-[477px] w-[800px]">
      {cards[current] && (
        <motion.div
          key={cards[current].id}
          className="absolute bg-white h-[477px] w-[800px] rounded-3xl  shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
          style={{
            transformOrigin: "top center",
          }}
          animate={{
            top: 0,
            scale: 1,
            zIndex: cards.length,
          }}
        >
          <div className="font-normal text-neutral-700 dark:text-neutral-200">
            {cards[current].content}
          </div>
          {/* Footer with navigation buttons */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-neutral-500 font-medium dark:text-white">
                {cards[current].name}
              </p>
              <p className="text-neutral-400 font-normal dark:text-neutral-200">
                {cards[current].designation}
              </p>
            </div>
            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button onClick={handlePrevious}>
                <ChevronLeft />
              </Button>
              <Button onClick={handleNext}>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
