"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Upload, Search, SlidersHorizontal, Package, Tag, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      <div className="bg-white border-b px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-8">{error}</div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-8 py-12">
              <div className="max-w-2xl mx-auto text-center">
                <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Start Adding Products
                </h2>
                <p className="text-gray-500 mb-8">
                  Begin building your inventory by adding products that your customers will love.
                  You can add products manually or import them in bulk.
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <Link 
                    href="/dashboard/product/productAdd"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    <span className="font-medium">Add Product</span>
                  </Link>
                  
                  <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="font-medium">Import Products</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link 
                  href={`/dashboard/product/${product.id}`}
                  key={product.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {product.media && product.media[0] ? (
                      <img
                        src={product.media[0].file_url}
                        alt={product.media[0].alt_text || product.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.product_type || 'No category'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-lg font-semibold text-gray-900">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${product.status === 'exists' ? 'bg-green-100 text-green-800' :
                            product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {product.status}
                        </span>
                        {product.inventory_quantity < 10 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low stock
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        Stock: {product.inventory_quantity}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products match your search.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Discover Products to Sell
            </h3>
            <p className="text-gray-600 mb-6">
              Explore dropshipping and print-on-demand products shipped directly from suppliers to your customers.
              Only pay for what you sell.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Explore Product Sourcing Apps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}