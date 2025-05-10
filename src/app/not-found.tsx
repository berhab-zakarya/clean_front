import Link from "next/link"
import Image from "next/image"
import Header from "@/components/common/Header"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f5fa] flex flex-col">
      {/* Header with logo placeholder */}
      <Header />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* 404 Image placeholder - add your own 404 image with all decorative elements here */}
        {/*<div className="relative max-w-2xl w-full mb-8">*/}
          <div className="relative max-w-2xl aspect-[16/9] w-fullrounded-lg flex items-center justify-center mb-8">
            <Image
                src="/assets/images/404_illustration.svg"
                alt="404 Page Not Found"
                width={800}
                height={450}
                priority
            />
          </div>
        {/* Text content below card */}
        <div className="text-center max-w-2xl mx-auto mt-8">
          <h2 className="text-[#303030] text-4xl md:text-5xl font-bold mb-4">Page not found</h2>
          <p className="text-[#828282] text-lg mb-8">
            Oops! Looks like you followed a bad link. If you think this is issue is from us, please tell us.
          </p>
          <Link
            href="/"
            className="inline-flex bg-[#1e3a8a] text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-[#1e3a8a]/90 transition-colors"
          >
            Go to home page
          </Link>
        </div>
      </main>
    </div>
  )
}
