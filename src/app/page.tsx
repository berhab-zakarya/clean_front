"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api/api";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import { LaptopSection } from "@/components/sections/LaptopSection";
import { medium } from "@/lib/fonts";
import Image from "next/image";
import Capabilities from "@/components/sections/CapabilitiesSection";
import WhyUse from "@/components/sections/WhyUseSection";
import Pricing from "@/components/sections/PricingSection";
import TestimonialSection from "@/components/sections/TestimonialsSection";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Optimized authentication check
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       // First check local storage - this is instant
  //       const accessToken = localStorage.getItem('access_token');
  //       const refreshToken = localStorage.getItem('refresh_token');
        
  //       if (accessToken && refreshToken) {
  //         // Start navigation to dashboard immediately if tokens exist
  //         // We don't need to wait for API validation to start the navigation
  //         router.push('/dashboard');
          
  //         // Optional: Validate in background to refresh tokens if needed
  //         try {
  //           await authAPI.validateSession();
  //         } catch (error) {
  //           // Token validation failed, but we'll let the dashboard handle this
  //           // The dashboard's auth protection will redirect back if needed
  //           console.warn('Token validation failed in background');
  //         }
  //       } else {
  //         // No tokens found, user can stay on home page
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       console.error('Auth check error:', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  // Render loading state or content
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${medium.className}`}>
      <Image fill className="relative -z-10" alt="" src={"/assets/images/hero_section_group.svg"} />
      <Header/>
  
      <div className="flex flex-col">
        <HeroSection/>
        <LaptopSection/>
        <Capabilities/>
        <div className="relative">
          <WhyUse />
          <div className="absolute left-0 top-1/2 h-[calc(100%+50px)] w-full -translate-y-1/2 -z-40">
            <Image
              src="/assets/images/grid_why_pricing.png"
              alt="Background Grid"
              fill
              className="object-cover"
            />
          </div>
          <Pricing />
        </div>
        <TestimonialSection/>
        <Newsletter/>
        <Footer/>
      </div>
    </div>
  );
}