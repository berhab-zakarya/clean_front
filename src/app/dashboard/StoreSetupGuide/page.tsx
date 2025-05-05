"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/common/ButtonModal";
import SimpleButton from "@/components/common/SimpleButton";
import { StoreNameDialog } from "@/components/dashboard/StoreSetupGuide/StoreNameDialog";

export default function EcommerceSetupGuide() {
  const [showBanner, setShowBanner] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    setup: true,
    name: true,
    domain: true,
    product: true,
    shipping: false,
    payment: false,
    testOrder: false,
  });
  const [isStoreNameDialogOpen, setIsStoreNameDialogOpen] = useState(false);
  const [currentStoreName, setCurrentStoreName] = useState("My Store");
  const router = useRouter();

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleStoreNameSubmit = (name: string) => {
    setCurrentStoreName(name);
    // Here you would typically make an API call to update the store name
  };

  return (
    <div className="font-sans max-w-5xl mx-auto">
      {/* Banner */}
      {showBanner && (
        <div className="mt-4 bg-[var(--primary-900)] text-white p-4 flex rounded-[24px] justify-between items-center">
          <p className="text-[20] font-[500] ml-[24px]">
            Select a plan to get 3 months for $1/month
          </p>
          <div className="flex gap-4 items-center">
            <SimpleButton
              title="Select a plan"
              className="bg-white text-[var(--primary-900)] rounded-full hover:bg-gray-100"
            />
            <X
              className="cursor-pointer"
              size={24}
              onClick={() => setShowBanner(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        <h1 className="text-[38px] font-[600] text-black mb-2">
          Get ready to sell
        </h1>
        <p className="text-gray-600 mb-6">
          Here's your guide to get started. You'll receive new tips and
          information here as your business grows.
        </p>

        {/* Setup Guide */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("setup")}
          >
            <h2 className="text-[20px] font-[600]">Setup guide</h2>
            {expandedSections.setup ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.setup && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Use this personalized guide to get your store up and running
              </p>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-2">
                  <span className="text-sm">0</span>
                </div>
                <span className="text-gray-700">of 7 tasks completed</span>
              </div>
            </div>
          )}
        </div>

       
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("name")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">Choose your store name</h2>
            </div>
            {expandedSections.name ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.name && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Your store's temporary name is currently {currentStoreName}. The store
                name appears in your admin and your online store.
              </p>
              <SimpleButton
            
                title="Choose store name"
                onClick={() => setIsStoreNameDialogOpen(true)}
              className="bg-[var(--primary-900)] text-white hover:bg-white hover:text-[var(--primary-900)] rounded-full transition-colors"
              />
            </div>
          )}
        </div>

        {/* Add Custom Domain */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("domain")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">Add custom domain</h2>
            </div>
            {expandedSections.domain ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {/* Add First Product */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("product")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">Add your first product</h2>
            </div>
            {expandedSections.product ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.product && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Write descriptions, add photos, and set pricing for the products
                you plan to sell.
              </p>

              <div className="flex items-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="mr-4"
                  onClick={() => router.push('/dashboard/product')}
                >
                  Add product
                </Button>
                <SimpleButton title="Importer un produit" className="bg-transparent font-[400]"/>
              
              </div>

              <div className="flex justify-end mt-4">
                <div className="grid grid-cols-2 gap-2 w-48">
                  <div className="bg-blue-400 h-24 rounded"></div>
                  <div className="bg-purple-200 h-12 rounded"></div>
                  <div className="col-span-1 bg-red-200 h-12 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optimize Shipping */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("shipping")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">Optimize shipping rates</h2>
            </div>
            {expandedSections.shipping ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {/* Configure Payment Provider */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("payment")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">
                Configure payment provider
              </h2>
            </div>
            {expandedSections.payment ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>

        {/* Place Test Order */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("testOrder")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">Place a test order</h2>
            </div>
            {expandedSections.testOrder ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
      </div>

      {/* Store Name Dialog */}
      <StoreNameDialog
        isOpen={isStoreNameDialogOpen}
        onClose={() => setIsStoreNameDialogOpen(false)}
        onSubmit={handleStoreNameSubmit}
      />
    </div>
  );
}
