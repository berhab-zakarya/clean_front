"use client"

import { useState, useEffect } from "react"
import { useBannerbear } from "../../hooks/use-bannerbear"
import { CustomizationPanel } from "../../components/ad-generator/customization-panel"
import { AdResult } from "../../components/ad-generator/ad-result"
import { Package } from "lucide-react"
import { Product as ProductFromPage} from "@/lib/types/product"
// Define the product type that matches the structure from products page


// Define the type expected by useBannerbear
interface ProductForAd {
  id: string;
  title: string;
  image_url: string;
  category: string;
  price: number;
  description: string;
}

interface AdGeneratorPageProps {
  initialProduct?: ProductFromPage | null;
}

export default function AdGeneratorPage({ initialProduct }: AdGeneratorPageProps) {
  const { loading: adLoading, error: adError, result, progress, generateAd, reset } = useBannerbear()

  const [selectedProduct, setSelectedProduct] = useState<ProductFromPage | null>(initialProduct || null)
  const [customization, setCustomization] = useState({})
  const [showCustomization, setShowCustomization] = useState(false)

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleCreateAd = async () => {
    if (selectedProduct) {
      try {
        // Transform the product to match the expected format for generateAd
        const transformedProduct: ProductForAd = {
          id: selectedProduct.id.toString(),
          title: selectedProduct.name,
          image_url: selectedProduct.images?.[0]?.image ,
          category: selectedProduct.category_name || '',
          price: parseFloat(selectedProduct.price),
          description: selectedProduct.description || ''
        };
        await generateAd(transformedProduct, customization)
      } catch {
        // Error is handled by the hook
      }
    }
  }

  const handleRetry = () => {
    if (selectedProduct) {
      // Transform the product to match the expected format for generateAd
      const transformedProduct: ProductForAd = {
        id: selectedProduct.id.toString(),
        title: selectedProduct.name,
        image_url: selectedProduct.images?.[0]?.image || '',
        category: selectedProduct.category_name || '',
        price: parseFloat(selectedProduct.price),
        description: selectedProduct.description || ''
      };
      generateAd(transformedProduct, customization)
    }
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-8 shadow-xl">
            <div className="text-slate-400 text-6xl">🎨</div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">No Product Selected</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Please select a product to generate an advertisement
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-slate-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
              AI Product Ad Generator
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Create stunning product advertisements in seconds using AI-powered design templates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Selection & Customization */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    {selectedProduct.images?.[0]?.image ? (
                      <div className="relative">
                        <img
                          src={selectedProduct.images[0].image}
                          alt={selectedProduct.name}
                          className="h-16 w-16 rounded-xl object-cover shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-lg">
                        <Package className="h-8 w-8 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{selectedProduct.name}</h3>
                    <p className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full inline-block">
                      {selectedProduct.category_name || "Uncategorized"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedProduct && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Customization</h3>
                    <button
                      onClick={() => setShowCustomization(!showCustomization)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
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
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                  >
                    {adLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 min-h-[600px] flex items-center justify-center">
                {!adLoading && !result && !adError ? (
                  <div className="text-center max-w-md mx-auto">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-8 shadow-xl">
                      <div className="text-slate-400 text-8xl">🎨</div>
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">Ready to Create</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Click the Create Ad button to generate your advertisement
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
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Experience the power of AI-driven advertisement creation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Lightning Fast</h3>
                <p className="text-slate-600 leading-relaxed">Generate professional ads in under 60 seconds</p>
              </div>

              <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fully Customizable</h3>
                <p className="text-slate-600 leading-relaxed">Adjust colors, fonts, and styling to match your brand</p>
              </div>

              <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">High Quality</h3>
                <p className="text-slate-600 leading-relaxed">Download high-resolution images ready for any platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}