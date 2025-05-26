"use client"

import { useState } from "react"
import { useProducts } from "../../hooks/use-products"
import { useBannerbear } from "../../hooks/use-bannerbear"
import { ProductSelector } from "../../components/ad-generator/product-selector"
import { CustomizationPanel } from "../../components/ad-generator/customization-panel"
import { AdResult } from "../../components/ad-generator/ad-result"
import type { Product } from "../../hooks/use-products"

export default function AdGeneratorPage() {
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { loading: adLoading, error: adError, result, progress, generateAd, reset } = useBannerbear()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customization, setCustomization] = useState({})
  const [showCustomization, setShowCustomization] = useState(false)

  const handleCreateAd = async () => {
    if (selectedProduct) {
      try {
        await generateAd(selectedProduct, customization)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  const handleRetry = () => {
    if (selectedProduct) {
      generateAd(selectedProduct, customization)
    }
  }

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Products</h1>
          <p className="text-gray-600">{productsError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Product Ad Generator</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create stunning product advertisements in seconds using AI-powered design templates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Selection & Customization */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <ProductSelector
                  products={products}
                  selectedProduct={selectedProduct}
                  onProductSelect={setSelectedProduct}
                />
              </div>

              {selectedProduct && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Customization</h3>
                    <button
                      onClick={() => setShowCustomization(!showCustomization)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showCustomization ? "Hide" : "Show"} Options
                    </button>
                  </div>

                  {showCustomization && (
                    <CustomizationPanel customization={customization} onCustomizationChange={setCustomization} />
                  )}

                  <button
                    onClick={handleCreateAd}
                    disabled={adLoading}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {adLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Create Ad
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
                {!selectedProduct && !adLoading && !result && !adError ? (
                  <div className="text-center">
                    <div className="text-gray-400 text-8xl mb-6">🎨</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Create</h3>
                    <p className="text-gray-600 text-lg">
                      Select a product from the left panel to start generating your ad
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <AdResult
                      imageUrl={result}
                      loading={adLoading}
                      error={adError}
                      progress={progress}
                      onRetry={handleRetry}
                      onReset={reset}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate professional ads in under 60 seconds</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Customizable</h3>
              <p className="text-gray-600">Adjust colors, fonts, and styling to match your brand</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600">Download high-resolution images ready for any platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
