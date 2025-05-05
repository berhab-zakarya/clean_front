"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api/api";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import { LaptopSection } from "@/components/sections/LaptopSection";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { bold, fontFamily, medium } from "@/lib/fonts";
import Image from "next/image";
import styles from '../components/sections/styles/laptop.module.css'
import Capabilities from "@/components/sections/CapabilitiesSection";
import WhyUse from "@/components/sections/WhyUseSection";
import Pricing from "@/components/sections/PricingSection";
import TestimonialSection from "@/components/sections/TestimonialsSection";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authAPI.validateSession();
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

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
