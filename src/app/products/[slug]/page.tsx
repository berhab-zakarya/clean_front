"use client"
import { notFound } from 'next/navigation'
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon } from "lucide-react"
import ProductGrid from "@/components/product/product-grid"
import Newsletter from "@/components/product/newsletter"
import ProductHeader from "@/components/product/header"
import { products } from "@/lib/products"
import { useState } from "react"
import Footer from '@/components/product/footer'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug)
  
  if (!product) {
    return notFound()
  }

  const [quantity, setQuantity] = useState(1)
  const [activeColorIndex, setActiveColorIndex] = useState(
    product.colors.findIndex(color => color.active)
  )
  const [activeSizeIndex, setActiveSizeIndex] = useState(
    product.sizes.findIndex(size => size.active)
  )

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="bg-white">
      {/* Added Product Header Here */}
      <ProductHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 lg:pr-10">
            <div className="rounded-xl overflow-hidden mb-5">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 lg:pl-5">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="stars text-xl">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    {i < Math.floor(product.rating) ? '★' : '☆'}
                  </span>
                ))}
                <span className="ml-1 text-base">{product.rating}</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-5">{product.reviews} reviews</div>

            <div className="flex items-center mb-5">
              <span className="text-2xl font-bold mr-4">{product.price}</span>
              <span className="text-lg text-gray-400 line-through mr-3">{product.originalPrice}</span>
              {product.discount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{product.discount}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Color Options */}
            <div className="mb-8">
              <div className="font-medium mb-4">Choose Color</div>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 rounded-full ${index === activeColorIndex ? "ring-2 ring-black ring-offset-2" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setActiveColorIndex(index)}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Size Options */}
            <div className="mb-8">
              <div className="font-medium mb-4">Choose Size</div>
              <div className="flex gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={size.name}
                    className={`w-12 h-12 rounded-lg border ${
                      index === activeSizeIndex
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-200"
                    }`}
                    onClick={() => setActiveSizeIndex(index)}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <button
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center"
                onClick={decreaseQuantity}
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                className="w-16 h-9 mx-3 text-center border-none" 
                value={quantity} 
                readOnly 
              />
              <button
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center"
                onClick={increaseQuantity}
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full py-6 rounded-full bg-black hover:bg-gray-800 text-white mb-8">
              ADD TO CART
            </Button>

            {/* Product Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start border-b mb-5 bg-transparent">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                >
                  Product Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                >
                  Ratings & Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="faqs"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                >
                  FAQs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <h3 className="text-lg font-medium mb-4">Product Details</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      All Reviews <span className="text-gray-500">({product.reviews})</span>
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">
                        All
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Latest
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        5 ★
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Write a Review
                      </Button>
                    </div>
                  </div>

                  {product.reviewList.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 mb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="stars text-yellow-400">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <span className="font-medium">{review.name}</span>
                        </div>
                        <div className="text-gray-500 text-sm">Posted on {review.date}</div>
                      </div>
                      <p className="text-gray-600">{review.content}</p>
                    </div>
                  ))}

                  <Button variant="outline" className="mx-auto block rounded-full border-black">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="faqs">
                <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {product.faqs.map((faq, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-medium mb-2">Q: {faq.question}</h4>
                      <p className="text-gray-600">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">YOU MAY ALSO LIKE</h2>
        <ProductGrid />
      </section>

      {/* Newsletter */}
      <Newsletter />
      <Footer />
    </div>
  )
}