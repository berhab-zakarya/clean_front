// lib/products/products.ts
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "vibe",
    slug: "hands-vibe",
    name: "HANDS VIBE",
    description: '27" 4K UHD IPS Monitor',
    price: "$299",
    originalPrice: "$349",
    discount: "-14%",
    rating: 4.6,
    reviews: 128,
    screenSize: '27"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "Silver", value: "#C0C0C0", active: false },
    ],
    sizes: [
      { name: '24"', active: false },
      { name: '27"', active: true },
    ],
    details: [
      "Resolution: 3840 x 2160 (4K UHD)",
      "Refresh Rate: 60Hz",
      "Response Time: 4ms",
      "Panel Type: IPS",
      "Color Gamut: 99% sRGB",
      "Brightness: 350 nits",
      "Connectivity: 2x HDMI 2.0, 1x DisplayPort 1.4",
      "VESA Mount Compatible: 100x100mm",
      "Built-in Speakers: 2x5W",
      "Eye Care Technology: Flicker-free, Low Blue Light"
    ],
    reviewList: [
      {
        id: 1,
        name: "Alex J.",
        rating: 5,
        date: "July 15, 2023",
        content: "The color accuracy is amazing for photo editing. Perfect for my design work."
      },
      {
        id: 2,
        name: "Sarah K.",
        rating: 4,
        date: "August 2, 2023",
        content: "Great monitor for the price. Only wish it had USB-C connectivity."
      }
    ],
    faqs: [
      {
        question: "Does this support HDR?",
        answer: "Yes, it supports HDR10 content."
      },
      {
        question: "Is this good for gaming?",
        answer: "While it's not specifically a gaming monitor, the 4ms response time is decent for casual gaming."
      }
    ]
  },
  {
    id: "magma",
    slug: "hands-magma",
    name: "HANDS MAGMA PRO",
    description: '32" QHD 165Hz Gaming Monitor',
    price: "$499",
    originalPrice: "$599",
    discount: "-17%",
    rating: 4.8,
    reviews: 256,
    screenSize: '32"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "Red", value: "#FF0000", active: false },
    ],
    sizes: [
      { name: '27"', active: false },
      { name: '32"', active: true },
    ],
    details: [
      "Resolution: 2560 x 1440 (QHD)",
      "Refresh Rate: 165Hz",
      "Response Time: 1ms (MPRT)",
      "Panel Type: Fast IPS",
      "Adaptive Sync: FreeSync Premium Pro",
      "Brightness: 400 nits",
      "Connectivity: 2x HDMI 2.1, 1x DisplayPort 1.4, USB Hub",
      "VESA Mount Compatible: 100x100mm",
      "RGB Lighting: Customizable rear lighting",
      "Gaming Features: Black Stabilizer, Crosshair Overlay"
    ],
    reviewList: [
      {
        id: 1,
        name: "Michael T.",
        rating: 5,
        date: "September 5, 2023",
        content: "The 165Hz refresh rate makes games buttery smooth. No ghosting at all!"
      },
      {
        id: 2,
        name: "Jessica L.",
        rating: 5,
        date: "September 12, 2023",
        content: "Upgraded from a 60Hz monitor and the difference is night and day."
      }
    ],
    faqs: [
      {
        question: "Is this G-Sync compatible?",
        answer: "Yes, it works with both FreeSync and G-Sync compatible systems."
      },
      {
        question: "Does it have speakers?",
        answer: "No, this model focuses on gaming performance and doesn't include speakers."
      }
    ]
  },
  
];