"use client"
import React from 'react'
import Button from '../common/Button'
import { chevronRight } from '@/lib/icons'
import Image from 'next/image'
import { TypewriterEffectSmooth } from '../ui/typewriter-effect'
import { words } from '@/lib/constants/ui'
import ButtonWithIcon from '../common/ButtonLaunch'
import { ChevronRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className='flex mt-36 flex-col justify-center items-center'>
         <Button
          className="group flex w-[167px] h-[32px] mb-4 px-3 items-center cursor-none border-2 border-[#F97316] bg-[#F97316] text-white justify-between rounded-[100px]
    transition-all duration-300 hover:scale-105 hover:bg-white hover:text-sm hover:text-[#F97316] text-[16px]
    active:scale-95 animate-glow"
          onClick={() => console.log("AI Features clicked")}
        >
          New AI Features {
            <ChevronRight  className='w-5 h-5 text-white transition-colors duration-300 group-hover:text-[#F97316]' />
          }
        </Button>
        <div className="flex mt-28 flex-col items-center justify-center">
          <TypewriterEffectSmooth words={words} />
        <p className='text-[28px] text-[#1E3A8A]'>Algecom</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <div className="mt-6 flex flex-col md:flex-row items-center gap-4 w-full ">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-[276px] h-[52px] px-4 rounded-[32px] border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
              
              <ButtonWithIcon className="text-sm">
                Launch your store
              
              </ButtonWithIcon>
            </div>
          </div>
        </div>
    </div>
  )
}

export default HeroSection