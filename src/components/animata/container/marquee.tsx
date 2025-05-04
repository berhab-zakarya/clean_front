"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useRef, useEffect, Children } from "react"

interface MarqueeProps {
  children: React.ReactNode
  vertical?: boolean
  className?: string
  pauseOnHover?: boolean
  applyMask?: boolean
  reverse?: boolean
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  vertical = false,
  className = "",
  pauseOnHover = false,
  applyMask = false,
  reverse = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) {
      return
    }

    const container = containerRef.current
    const content = contentRef.current

    let animationId: number

    const animate = () => {
      if (!content || !container) return

      const contentSize = vertical ? content.offsetHeight : content.offsetWidth
      const containerSize = vertical ? container.offsetHeight : container.offsetWidth

      if (contentSize <= containerSize) {
        return // No need to animate if content fits within the container
      }

      const speed = 0.5 // Adjust speed as needed
      let currentOffset = 0

      const step = () => {
        if (!content || !container) return

        // Increment or decrement based on direction
        currentOffset += reverse ? -speed : speed

        // Reset when we've gone through the entire content
        if (reverse) {
          if (currentOffset < 0) {
            currentOffset = contentSize
          }
        } else {
          if (currentOffset > contentSize) {
            currentOffset = 0
          }
        }

        // Apply the transform
        if (vertical) {
          content.style.transform = `translateY(${reverse ? currentOffset : -currentOffset}px)`
        } else {
          content.style.transform = `translateX(${reverse ? currentOffset : -currentOffset}px)`
        }

        animationId = requestAnimationFrame(step)
      }

      animationId = requestAnimationFrame(step)
    }

    animate()

    // Pause animation on hover if enabled
    if (pauseOnHover) {
      const handleMouseEnter = () => {
        cancelAnimationFrame(animationId)
      }

      const handleMouseLeave = () => {
        animate()
      }

      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        cancelAnimationFrame(animationId)
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [children, vertical, pauseOnHover, reverse])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        className,
        applyMask && vertical ? "mask-vertical" : applyMask && !vertical ? "mask-horizontal" : "",
      )}
      style={{ width: "100%", height: "100%" }}
    >
      <div
        ref={contentRef}
        className={cn("flex-shrink-0", vertical ? "flex flex-col" : "flex flex-row")}
        style={{ willChange: "transform" }}
      >
        {Children.toArray(children)}
      </div>
      <style jsx>{`
      @keyframes scrollY {
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  @keyframes scrollYReverse {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0%);
    }
  }

  .scroll {
    animation: scrollY linear infinite;
    animation-duration: var(--duration, 30s);
    will-change: transform;
  }

  .scroll.reverse {
    animation-name: scrollYReverse;
  }

  .pause-on-hover:hover .scroll {
    animation-play-state: paused;
  }
      `}</style>
    </div>
  )
}

export default Marquee
