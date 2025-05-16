"use client";

import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import DottedMap from "dotted-map";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

const Spotlight = memo(({ className, fill }: SpotlightProps) => {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "#6366f1"}
          fillOpacity="0.15"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
});

Spotlight.displayName = "Spotlight";

interface WorldMapProps {
  dots?: Array<{
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  }>;
  lineColor?: string;
}

const WorldMap = memo(({ dots = [], lineColor = "#6366f1" }: WorldMapProps) => {
  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: "#6366f140",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, []);

  const pathsAndPoints = useMemo(() => {
    const projectPoint = (lat: number, lng: number) => {
      const x = (lng + 180) * (800 / 360);
      const y = (90 - lat) * (400 / 180);
      return { x, y };
    };

    const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midX = (start.x + end.x) / 2;
      const midY = Math.min(start.y, end.y) - 50;
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };

    return dots.map(dot => {
      const startPoint = projectPoint(dot.start.lat, dot.start.lng);
      const endPoint = projectPoint(dot.end.lat, dot.end.lng);
      const path = createCurvedPath(startPoint, endPoint);
      
      return { 
        startPoint,
        endPoint,
        path 
      };
    });
  }, [dots]);

  return (
    <div className="w-full aspect-[2/1] relative font-sans">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
        loading="lazy"
      />
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          
          <radialGradient id="point-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </radialGradient>
          
          <circle id="point-template" r="2" fill={lineColor} />
        </defs>

        {pathsAndPoints.map((item, i) => (
          <g key={`connection-${i}`}>
            <motion.path
              d={item.path}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.5 * i,
                ease: "easeOut",
              }}
            />
            
            <use 
              href="#point-template" 
              x={item.startPoint.x} 
              y={item.startPoint.y} 
            />
            <circle
              cx={item.startPoint.x}
              cy={item.startPoint.y}
              r="2"
              fill={lineColor}
              opacity="0.5"
            >
              <animate attributeName="r" from="2" to="8" dur="2s" begin="0s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
            </circle>
            
            <use 
              href="#point-template" 
              x={item.endPoint.x} 
              y={item.endPoint.y} 
            />
            <circle
              cx={item.endPoint.x}
              cy={item.endPoint.y}
              r="2"
              fill={lineColor}
              opacity="0.5"
            >
              <animate attributeName="r" from="2" to="8" dur="2s" begin="0s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
});

WorldMap.displayName = "WorldMap";

const DEFAULT_DOTS = [
  {
    start: { lat: 64.2008, lng: -149.4937 },
    end: { lat: 34.0522, lng: -118.2437 },
  },
  {
    start: { lat: 34.0522, lng: -118.2437 },
    end: { lat: -15.7975, lng: -47.8919 },
  },
  {
    start: { lat: -15.7975, lng: -47.8919 },
    end: { lat: 51.5074, lng: -0.1278 },
  },
  {
    start: { lat: 51.5074, lng: -0.1278 },
    end: { lat: 28.6139, lng: 77.209 },
  },
  {
    start: { lat: 28.6139, lng: 77.209 },
    end: { lat: 35.6762, lng: 139.6503 },
  },
];

interface MergedComponentProps {
  content?: React.ReactNode;
}

export default function MergedComponent({ content }: MergedComponentProps) {
  const gridBackgroundClasses = cn(
    "absolute inset-0",
    "-z-10",
    "[background-size:40px_40px]",
    "[background-image:linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0f172a]">
      {/* Grid Background */}
      <div className={gridBackgroundClasses} />
      
      {/* Radial gradient */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0f172a] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      {/* Spotlight components */}
      <div className="relative">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#6366f1" />
        <Spotlight className="top-40 right-0 md:top-20 md:right-60" fill="#8b5cf6" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 py-8 mt-16">
        {content ? (
          <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
            {content}
          </div>
        ) : (
          <ContainerTextFlip
            words={["Build", "Push", "Install", "Test", "Deploy"]}
          />
        )}
      </div>
      
      {/* World Map */}
      <div className="absolute bottom-0 w-full opacity-40 z-1">
        <WorldMap dots={DEFAULT_DOTS} lineColor="#6366f1" />
      </div>
    </div>
  );
}