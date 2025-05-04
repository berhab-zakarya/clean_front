"use client";
import Image from "next/image";
import Button from "../common/Button";

const Newsletter = () => {
  return (
    <section className="py-32 relative ">
          <Image
  className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 object-cover"
  src="/assets/images/grid_news.png"
  width={840}
  height={550}
  alt="Testimonials background"
/>

      <div className="container mx-auto flex">
        <div className="flex  w-full justify-around items-start">
          <div className="flex flex-col items-start">
            {" "}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#2D2E83]">
              Get exclusive content
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and get the latest design ideas,
              articles, resources <br/> and inspiration.
            </p>
          </div>
          <div className="max-w-3xl"> </div>
          <div className="flex  gap-4  items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-[276px] h-[52px] px-4 rounded-[32px] border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Button className="px-8 rounded-[32px]">Sign up</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
