"use client";

import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import DottedMap from "dotted-map";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

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
  const deploymentSteps = [
    {
      text: "Deploying",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400",
    },
    {
      text: "your",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400",
    },
    {
      text: "application",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400",
    },
    {
      text: "to",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400",
    },
    {
      text: "production",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400",
    },
  ];

  const deploymentStatus = [
    {
      status: "Building",
      progress: 100,
      color: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400",
      time: "2.3s",
      icon: "🏗️",
    },
    {
      status: "Testing",
      progress: 100,
      color: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400",
      time: "1.8s",
      icon: "🧪",
    },
    {
      status: "Optimizing",
      progress: 75,
      color: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400",
      time: "3.2s",
      icon: "⚡",
    },
    {
      status: "Deploying",
      progress: 45,
      color: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400",
      time: "4.5s",
      icon: "🚀",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes rocket-trail {
          0% { transform: scale(1) translateX(0); opacity: 0.8; }
          100% { transform: scale(0.5) translateX(-50px); opacity: 0; }
        }

        @keyframes meteor {
          0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 1; }
          100% { transform: translateX(1000px) translateY(1000px) rotate(45deg); opacity: 0; }
        }

        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
          background-size: 200% 200%;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-rocket-trail {
          animation: rocket-trail 1s ease-out infinite;
        }

        .animate-meteor {
          animation: meteor 2s linear infinite;
        }
      `}</style>
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
        {/* Space Background */}
        <div className="absolute inset-0">
          {/* Deep space gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-black to-purple-950 animate-gradient-shift" />
          
          {/* Nebula effect */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.4),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,182,193,0.3),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(147,197,253,0.3),rgba(255,255,255,0))]" />
          </div>

          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(150)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.5 + 0.5,
                  scale: Math.random() * 0.5 + 0.5,
                }}
              />
            ))}
          </div>

          {/* Meteors */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`meteor-${i}`}
              className="absolute w-2 h-2 bg-white rounded-full animate-meteor"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${i * 3}s`,
              }}
            >
              <div className="absolute w-40 h-1 bg-gradient-to-r from-white to-transparent -left-40 top-1/2 -translate-y-1/2" />
            </motion.div>
          ))}

          {/* Rocket */}
          <motion.div
            className="absolute w-24 h-24 animate-float"
            initial={{ x: -100, y: "30%" }}
            animate={{ x: "120%" }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rocket body */}
              <path
                d="M50 10L70 40H30L50 10Z"
                fill="white"
                fillOpacity="0.9"
              />
              <rect x="40" y="40" width="20" height="40" fill="white" fillOpacity="0.9" />
              {/* Rocket fins */}
              <path
                d="M30 40L20 60L30 60L40 40M70 40L80 60L70 60L60 40"
                fill="white"
                fillOpacity="0.9"
              />
              {/* Rocket window */}
              <circle cx="50" cy="50" r="5" fill="#1a1a1a" />
              {/* Rocket flames */}
              <path
                d="M40 80L50 90L60 80"
                stroke="#ff6b6b"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M35 75L50 85L65 75"
                stroke="#ff6b6b"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            {/* Rocket trail */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-rocket-trail" />
          </motion.div>

          {/* Space dust particles */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight],
                  x: [null, Math.random() * window.innerWidth],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Glowing orbs */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className="absolute w-64 h-64 rounded-full mix-blend-screen filter blur-3xl opacity-20"
                style={{
                  background: `radial-gradient(circle, ${
                    i === 0 ? 'rgba(147,197,253,0.3)' :
                    i === 1 ? 'rgba(255,182,193,0.3)' :
                    'rgba(120,119,198,0.3)'
                  }, transparent 70%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 5 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
          {/* Enhanced Deployment Status Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-3xl opacity-30" />
              <TypewriterEffect words={deploymentSteps} className="text-5xl md:text-7xl font-bold mb-6 relative" />
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center justify-center space-x-2 text-white/80"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse"></div>
              <span className="text-sm font-mono">Live Deployment in Progress</span>
            </motion.div>
          </motion.div>

          {content ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {content}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-4xl mx-auto space-y-6"
            >
              {/* Enhanced Deployment Progress Cards */}
              {deploymentStatus.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{step.icon}</span>
                          <h3 className="text-lg font-mono text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{step.status}</h3>
                        </div>
                        <span className="text-sm font-mono text-white/60">{step.time}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={cn("h-2 rounded-full", step.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Enhanced Deployment Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="font-mono bg-gradient-to-r from-violet-400 to-fuchsia-400 text-white border-0">Deployment Info</Badge>
                      <span className="text-sm font-mono text-white/60">v1.0.0</span>
                    </div>
                    <div className="space-y-2 font-mono text-sm text-white/60">
                      <p>Branch: main</p>
                      <p>Environment: production</p>
                      <p>Build ID: #1234</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        {/* Enhanced World Map */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-0 w-full z-1"
        >
          <WorldMap dots={DEFAULT_DOTS} lineColor="#a855f7" />
        </motion.div>
      </div>
    </>
  );
}