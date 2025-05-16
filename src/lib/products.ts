export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount?: string;
  image: string;
  rating: number;
  reviews: number;
  screenSize: string;
  colors: {
    name: string;
    value: string;
    active: boolean;
  }[];
  sizes: {
    name: string;
    active: boolean;
  }[];
  details: string[];
  reviewList: {
    id: number;
    name: string;
    rating: number;
    date: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const products: Product[] = [
  {
    id: "vibe",
    slug: "hands-vibe",
    name: "HANDS VIBE",
    description: '27" 4K 4.6/5',
    price: "$120",
    originalPrice: "$150",
    discount: "-20%",
    image: "/images/curved-vibe.png",
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
      "Screen Size: 27 inches",
      "Resolution: 3840 x 2160 (4K)",
      "Refresh Rate: 60Hz",
      "Response Time: 4ms",
      "Panel Type: IPS",
      "Connectivity: HDMI, DisplayPort",
      "Built-in Speakers: Yes",
      "Adjustable Stand: Height, Tilt",
      "VESA Compatible: Yes (100 x 100mm)",
      "HDR Support: HDR10",
    ],
    reviewList: [
      {
        id: 1,
        name: "Alex J.",
        rating: 5,
        date: "July 15, 2023",
        content: "Great monitor for the price! The 4K resolution is stunning and colors are vibrant."
      }
    ],
    faqs: [
      {
        question: "Does this support HDR?",
        answer: "Yes, it supports HDR10."
      }
    ]
  },
  {
    id: "magma",
    slug: "hands-magma",
    name: "HANDS MAGMA",
    description: "144Hz 4.8/5",
    price: "$240",
    originalPrice: "$320",
    discount: "-25%",
    image: "/images/hands-magma.png",
    rating: 4.8,
    reviews: 256,
    screenSize: '27"',
    colors: [
      { name: "Black", value: "#333333", active: true },
      { name: "Green", value: "#556B2F", active: false },
      { name: "Blue", value: "#1E3A8A", active: false },
    ],
    sizes: [
      { name: '24"', active: false },
      { name: '27"', active: true },
      { name: '32"', active: false },
    ],
    details: [
      "Screen Size: 27 inches",
      "Resolution: 2560 x 1440 (WQHD)",
      "Refresh Rate: 144Hz",
      "Response Time: 1ms",
      "Panel Type: IPS",
      "Connectivity: HDMI, DisplayPort, USB",
      "Built-in Speakers: Yes",
      "Adjustable Stand: Height, Tilt, Swivel",
      "VESA Compatible: Yes (100 x 100mm)",
      "HDR Support: HDR10",
    ],
    reviewList: [
      {
        id: 1,
        name: "Samantha D.",
        rating: 5,
        date: "August 15, 2023",
        content: "This monitor exceeded my expectations! The colors are vibrant and the refresh rate makes gameplay incredibly smooth."
      },
      {
        id: 2,
        name: "Alex M.",
        rating: 5,
        date: "August 12, 2023",
        content: "I'm really impressed with the quality of this monitor. The 144Hz refresh rate is perfect for gaming."
      }
    ],
    faqs: [
      {
        question: "Does this monitor support G-Sync?",
        answer: "Yes, it's G-Sync compatible though not certified."
      }
    ]
  },
 
];