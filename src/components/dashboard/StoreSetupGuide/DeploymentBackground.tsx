"use client";

import React, { useMemo, memo, useState, useEffect } from "react";

// Seeded random number generator for consistent values
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Enhanced Spotlight component with new colors
const Spotlight = memo(({ className = "", fill = "#1D1178" }) => {
  const spotlightStyle = useMemo(() => ({
    filter: 'url(#filter)',
    fill: fill,
    fillOpacity: "0.25"
  }), [fill]);

  return (
    <svg
      className={`pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-30 ${className}`}
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
          style={spotlightStyle}
        />
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
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
});

Spotlight.displayName = "Spotlight";

// TypeWriter Effect Component
const TypewriterEffect = ({ words, className = "" }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex]?.text || '';
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <div className={className}>
      <span style={{ 
        background: 'linear-gradient(135deg, #B49DFE, #CEBEFE)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {currentText}
      </span>
      <span style={{ color: '#B49DFE' }} className="animate-pulse">|</span>
    </div>
  );
};

// Card Component (simplified)
const Card = ({ children, className = "", style = {} }) => (
  <div className={`rounded-lg shadow-lg ${className}`} style={style}>
    {children}
  </div>
);

export default function DeploymentBackground({ content, showDefaultContent = false }) {
  // Color palette from the image
  const colors = {
    navy: {
      darkest: '#1D1178',
      dark: '#2D1D92', 
      medium: '#432EB5',
      light: '#5E43D8',
      lightest: '#7C5CFC'
    },
    orange: {
      darkest: '#9F84FD',
      dark: '#B49DFE',
      medium: '#CEBEFE', 
      light: '#E7DEFE',
      lightest: '#FFFFFF'
    }
  };

  const deploymentSteps = useMemo(() => [
    { text: "Deploying" },
    { text: "Store" },
    { text: "to" },
    { text: "Production" },
  ], []);

  const deploymentStatus = useMemo(() => [
    {
      status: "Environment Setup",
      progress: 100,
      time: "2.3s",
      icon: "🏗️",
      description: "Initializing deployment environment",
      color: colors.navy.darkest
    },
    {
      status: "Building Store",
      progress: 100,
      time: "1.8s",
      icon: "🏪",
      description: "Compiling store components and assets",
      color: colors.navy.dark
    },
    {
      status: "Security Checks",
      progress: 85,
      time: "3.2s",
      icon: "🛡️",
      description: "Running security and payment validation",
      color: colors.navy.medium
    },
    {
      status: "Database Migration",
      progress: 65,
      time: "4.5s",
      icon: "💾",
      description: "Setting up product catalogs and inventory",
      color: colors.navy.light
    },
    {
      status: "Go Live",
      progress: 25,
      time: "2.1s",
      icon: "🚀",
      description: "Launching store to production",
      color: colors.navy.lightest
    },
  ], [colors]);

  const starPositions = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => {
      const seed = i + 1;
      return {
        left: `${seededRandom(seed) * 100}%`,
        top: `${seededRandom(seed + 1) * 100}%`,
        delay: `${seededRandom(seed + 2) * 3}s`,
        opacity: seededRandom(seed + 3) * 0.6 + 0.2,
        scale: seededRandom(seed + 4) * 0.6 + 0.4,
      };
    })
  , []);

  const animationStyles = `
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-15px) rotate(2deg); }
      75% { transform: translateY(-5px) rotate(-1deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(159, 132, 253, 0.3); }
      50% { box-shadow: 0 0 40px rgba(159, 132, 253, 0.6); }
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
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

    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .animate-shimmer {
      animation: shimmer 2s ease-in-out infinite;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    * {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `;

  return (
    <div className="relative min-h-screen w-full" style={{ 
      backgroundColor: '#0a0a0a',
      overflowY: 'scroll',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <style>{animationStyles}</style>

      {/* Enhanced Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: `linear-gradient(135deg, ${colors.navy.darkest} 0%, #000000 35%, ${colors.navy.dark} 70%, ${colors.navy.medium} 100%)`
          }}
        />
        
        {/* Multiple Spotlight Effects */}
        <Spotlight className="top-0 left-0" fill={colors.navy.light} />
        <Spotlight className="bottom-0 right-0" fill={colors.orange.darkest} style={{ transform: 'rotate(180deg)' }} />
        
        {/* Enhanced Nebula Effects */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: colors.navy.light, opacity: 0.15 }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl"
            style={{ backgroundColor: colors.orange.darkest, opacity: 0.2 }}
          />
        </div>

        {/* Enhanced Stars */}
        <div className="absolute inset-0">
          {starPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                opacity: pos.opacity,
                transform: `scale(${pos.scale})`,
                width: '2px',
                height: '2px',
                backgroundColor: i % 3 === 0 ? colors.orange.light : '#ffffff'
              }}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute animate-float" style={{ left: '10%', top: '15%' }}>
          <div className="w-16 h-16 relative opacity-60">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.orange.light} />
                  <stop offset="100%" stopColor={colors.navy.light} />
                </linearGradient>
              </defs>
              <path d="M50 10L70 40H30L50 10Z" fill="url(#rocketGradient)" />
              <rect x="40" y="40" width="20" height="40" fill="url(#rocketGradient)" />
              <path d="M30 40L20 60L30 60L40 40M70 40L80 60L70 60L60 40" fill={colors.orange.medium} />
              <circle cx="50" cy="50" r="4" fill={colors.navy.darkest} />
              <path d="M45 80L50 90L55 80" fill={colors.orange.darkest} />
            </svg>
          </div>
        </div>

        {/* Store Icon */}
        <div className="absolute animate-float" style={{ right: '15%', top: '25%', animationDelay: '2s' }}>
          <div className="w-12 h-12 opacity-40 text-2xl">🏪</div>
        </div>
      </div>

      {/* Header - Always Visible */}
      <div className="relative z-30 text-center pt-8 pb-4">
        <div className="relative mb-4">
          <div 
            className="absolute inset-0 blur-3xl opacity-20 rounded-full"
            style={{ backgroundColor: colors.orange.darkest }}
          />
          <TypewriterEffect 
            words={deploymentSteps} 
            className="text-3xl md:text-5xl font-bold relative z-10"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-3 text-white/70">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.orange.medium }}
          />
          <span className="text-sm font-mono tracking-wider">Store Deployment in Progress</span>
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.orange.medium, animationDelay: '0.5s' }}
          />
        </div>
      </div>

      {/* Center Content Area */}
      <div className="relative z-20 flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {content ? (
          // Custom content provided
          <div className="w-full max-w-6xl mx-auto">
            <div 
              className="w-full rounded-xl border border-white/10 p-6"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {content}
            </div>
          </div>
        ) : showDefaultContent ? (
          // Default deployment status
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {deploymentStatus.map((step, index) => (
              <Card 
                key={index} 
                className="relative overflow-hidden border-0 animate-pulse-glow"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderLeft: `4px solid ${step.color}`
                }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <h3 
                          className="text-lg font-bold"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.orange.light}, ${colors.orange.medium})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          {step.status}
                        </h3>
                        <p className="text-xs text-white/60">{step.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{step.progress}%</div>
                      <div className="text-xs font-mono text-white/50">{step.time}</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative">
                    <div 
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ 
                          width: `${step.progress}%`,
                          background: `linear-gradient(90deg, ${step.color}, ${colors.orange.medium})`
                        }}
                      >
                        <div 
                          className="absolute inset-0 opacity-50 animate-shimmer"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer Status */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-2 text-white/50 text-xs">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.navy.light }}
          />
          <span>Terminal Ready</span>
        </div>
      </div>
    </div>
  );
}