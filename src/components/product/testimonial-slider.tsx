"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    text: "I'm blown away by the quality and performance of the monitor I received from ZJ.CO. The refresh rate is incredible and the colors are vibrant. Perfect for my gaming setup!",
    verified: true,
  },
  {
    id: 2,
    name: "Alex K.",
    text: "Finding a monitor that aligns with my professional needs used to be a challenge until I discovered ZJ.CO. The range of options they offer is truly remarkable, catering to both gaming and work.",
    verified: true,
  },
  {
    id: 3,
    name: "James L.",
    text: "As someone who's always on the lookout for high-performance monitors, I'm thrilled to have stumbled upon ZJ.CO. The selection is not only diverse but also on-point with the latest technology.",
    verified: true,
  },
  {
    id: 4,
    name: "Emily R.",
    text: "The customer service at ZJ.CO is exceptional. They helped me find the perfect monitor for my needs and the delivery was super fast. Highly recommend!",
    verified: true,
  },
  {
    id: 5,
    name: "Michael T.",
    text: "I've purchased multiple monitors from ZJ.CO and have never been disappointed. The quality is consistent and the prices are competitive. My go-to shop for all my display needs.",
    verified: true,
  },
]

export default function TestimonialSlider() {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="min-w-[280px] max-w-[300px] bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-shrink-0 snap-start"
          >
            <div className="stars mb-3">★ ★ ★ ★ ★</div>
            <div className="flex items-center mb-4">
              <span className="font-semibold">{testimonial.name}</span>
              {testimonial.verified && <span className="verified-badge ml-2">✓</span>}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{testimonial.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
