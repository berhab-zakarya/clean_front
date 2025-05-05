import { useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <div className="p-4 relative">
        <div role="status">
          <p className="sr-only">Produits. Cette page est prête</p>
        </div>
        
        <div className="flex flex-row items-center">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-brand-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </span>
                <div className="ml-2">
                  <h1 className="text-xl font-semibold">Produits</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="flex flex-col">
        <div className="bg-white rounded-lg shadow">
          {/* Index Filters */}
          <div className="min-h-12">
            <div className="flex justify-between px-4">
              {/* Tabs */}
              <div className="flex items-center">
                <div className="flex">
                  <div className="py-2 px-2">
                    <div className="flex">
                      <ul role="tablist" className="flex">
                        <li role="presentation">
                          <button 
                            id="all" 
                            className={`flex items-center py-1 px-3 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            role="tab"
                            aria-selected={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                          >
                            <span>All</span>
                          </button>
                        </li>
                      </ul>
                      <div>
                        <button 
                          id="create-new-view" 
                          className="flex items-center py-1 px-3 text-sm"
                          aria-label="Créer une nouvelle vue"
                        >
                          <span className="sr-only">Créer une nouvelle vue</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 rounded border border-gray-300 text-gray-400 cursor-not-allowed"
                  aria-label="Rechercher et filtrer les résultats"
                  aria-disabled="true"
                >
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  </div>
                </button>
                <button
                  className="p-2 rounded border border-gray-300 text-gray-400 cursor-not-allowed"
                  aria-label="Trier les résultats"
                  aria-disabled="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5h10"></path>
                    <path d="M11 9h7"></path>
                    <path d="M11 13h4"></path>
                    <path d="M3 17h18"></path>
                    <path d="M3 12V5l4 4z"></path>
                    <path d="M7 5v7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Add Products */}
          <div className="px-8 py-10">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col space-y-1">
                    <h2 className="text-xl font-normal">Ajouter vos produits</h2>
                    <p className="text-sm text-gray-600">Commencez par ajouter à votre boutique les produits que vos clients vont adorer.</p>
                    <div className="pt-4">
                      <div className="flex flex-wrap gap-3">
                        <Link href="/store/0wzn4a-38/products/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          <span className="text-sm font-semibold">Ajouter un produit</span>
                        </Link>
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 3v12"></path>
                          </svg>
                          <span className="text-sm">Importer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Find Products Section */}
        <div className="bg-gray-50 px-8 py-6">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-normal">Trouver des produits à vendre</h3>
                <p className="text-sm text-gray-600">Faites expédier les produits en dropshipping ou en impression à la demande directement du fournisseur à votre client, et ne payez que ce que vous vendez.</p>
                <div className="pt-3">
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href="https://apps.shopify.com/login/authenticate?shop=0wzn4a-38&login_hint=alaeprop%40gmail.com&url=https%3A%2F%2Fapps.shopify.com%2Fstories%2Fguide-dropshipping%3Fst_campaign%3Dproduct-index%26st_source%3Dadmin-web%26utm_campaign%3Dproduct-index%26utm_source%3Dshopify%26utm_content%3Dfind-products-to-sell" 
                      rel="noopener noreferrer" 
                      target="_blank"
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                    >
                      Parcourir les applications d'approvisionnement en produits
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}