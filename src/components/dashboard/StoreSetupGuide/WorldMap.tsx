import React, { useMemo } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";

export interface WorldMapProps {
  dots?: Array<{
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  }>;
  lineColor?: string;
}

const WorldMap = ({ dots = [], lineColor = "#6366f1" }: WorldMapProps) => {
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
};

export default WorldMap; 