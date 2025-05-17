import { MinusIcon, PlusIcon } from "lucide-react";

import React from "react";

export const ProductIcons = {
  minus: React.createElement(MinusIcon, { className: "w-4 h-4" }),
  plus: React.createElement(PlusIcon, { className: "w-4 h-4" }),
  star: (filled: boolean) =>
    React.createElement(
      "span",
      { className: filled ? "text-yellow-400" : "text-gray-300" },
      filled ? "★" : "☆"
    )
};