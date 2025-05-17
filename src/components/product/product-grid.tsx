import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/products/products"
import { ProductImages } from "@/app/products/[slug]/images"

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        const productImage = ProductImages.products[product.slug as keyof typeof ProductImages.products]?.main || ProductImages.placeholder
        
        return (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="overflow-hidden rounded-lg mb-3">
                <Image
                  src={productImage}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-auto aspect-square object-cover transition-transform hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{product.description}</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg">{product.price}</p>
                {product.discount && (
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </span>
                <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}