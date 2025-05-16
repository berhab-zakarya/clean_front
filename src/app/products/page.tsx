import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product/product-grid"
import TestimonialSlider from "@/components/product/testimonial-slider"
import Newsletter from "@/components/product/newsletter"
import ProductHeader from "@/components/product/header" // Import the header component
import Footer from "@/components/product/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Added Product Header Here */}
      <ProductHeader />
      
      {/* Hero Banner */}
      <div className="w-full h-[529px] bg-gray-900 bg-[url('/images/banner.jpg')] bg-cover bg-center relative flex items-start p-10">
        <div className="text-white max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">UPGRADE YOUR FRAMES WITH LOWER PRICES.</h1>
          <p className="text-sm leading-relaxed mb-6">
            Browse through our diverse range of meticulously crafted monitors, designed to bring out your gaming
            experience and cater to your professional needs.
          </p>
          <Button asChild className="rounded-full bg-white text-black hover:bg-gray-100">
            <Link href="/products">Shop Now</Link>
          </Button>

          <div className="flex gap-10 mt-20">
            <div>
              <div className="text-3xl font-bold mb-1">200+</div>
              <div className="text-xs opacity-80">International Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">2,000+</div>
              <div className="text-xs opacity-80">High-Quality Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">30,000+</div>
              <div className="text-xs opacity-80">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="w-full h-[122px] bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
        NEW MONITORS ARE COMING!
      </div>

      {/* New Arrivals Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">NEW ARRIVALS</h2>
        <ProductGrid />
        <div className="text-center mt-8">
          <Button className="bg-black hover:bg-gray-800 text-white">View All</Button>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">TOP SELLING</h2>
        <ProductGrid />
        <div className="text-center mt-8">
          <Button className="bg-black hover:bg-gray-800 text-white">View All</Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-3xl font-bold px-4 mb-8">OUR HAPPY CUSTOMERS</h2>
        <TestimonialSlider />
      </section>

      {/* Newsletter */}
      <Newsletter />
      <Footer />
    </div>
  )
}