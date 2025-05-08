"use client";

import LogoWhite from "@/components/common/LogoWhite";
import AlgecomQuestionnaire from "@/components/onboarding/AlgecomQuestionnaire";
import React from 'react';


const OnboardingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-[#1E3A8A]">
      {/* Logo Container */}
      <div className="absolute top-8 left-8 relative transition-transform duration-300 hover:rotate-2">
       <LogoWhite />
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          
          <AlgecomQuestionnaire />
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;