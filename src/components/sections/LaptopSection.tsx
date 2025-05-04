import Image from 'next/image';
import React from 'react';

export const LaptopSection = () => {
  return (
    <div className="relative flex flex-col items-center ">
      {/* Laptop Image */}
      <Image
        src={"/assets/images/laptop.svg"}
        width={1439}
        height={802}
        alt="Laptop"
      />
      <div className="absolute bottom-[-70px] w-full h-[114px] bg-[#1E3A8A] px-12 items-center flex overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-32 px-32" dir="rtl">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((n, i) => (
            <Image
              key={i}
              src={`/assets/images/partners/ptr_${n}.png`}
              alt={`Partner ${n}`}
              width={100}
              height={50}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
