"use client"

import type { Product } from "../../hooks/use-products"

interface ProductSelectorProps {
  products: Product[]
  selectedProduct: Product | null
  onProductSelect: (product: Product | null) => void
  loading?: boolean
}

export function ProductSelector({ products, selectedProduct, onProductSelect, loading = false }: ProductSelectorProps) {
  const handleSelectChange = (productId: string) => {
    if (productId === "") {
      onProductSelect(null)
    } else {
      const product = products.find((p) => p.id === productId)
      onProductSelect(product || null)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Product
        </label>
        <select
          id="product-select"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onChange={(e) => handleSelectChange(e.target.value)}
          value={selectedProduct?.id || ""}
        >
          <option value="">Choose a product...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title} - {product.price} DA
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Product</h3>
          <div className="flex items-start space-x-4">
            <img
              src={selectedProduct.image_url || "/placeholder.svg"}
              alt={selectedProduct.title}
              className="w-20 h-20 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-lg">{selectedProduct.title}</h4>
              <p className="text-blue-600 font-semibold text-xl">{selectedProduct.price} DA</p>
              <p className="text-gray-600 text-sm mt-1">{selectedProduct.description}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {selectedProduct.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
