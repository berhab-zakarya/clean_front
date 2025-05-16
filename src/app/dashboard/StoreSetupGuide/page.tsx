"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimpleButton from "@/components/common/SimpleButton";
import { CreateStore } from "@/components/dashboard/StoreSetupGuide/CreateStore";
import { CompleteProfile } from "@/components/dashboard/StoreSetupGuide/CompleteProfile";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function EcommerceSetupGuide() {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    setup: true,
    profile: true, // First step always open
    name: false,
    product: false,
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    profile: false,
    storeName: false,
    products: false,
  });

  const toggleSection = (section: string) => {
    // Only allow expanding if previous steps are completed
    if (section === "name" && !completedSteps.profile) {
      toast.error("Please complete your profile first");
      return;
    }
    if (section === "product" && !completedSteps.storeName) {
      toast.error("Please create your store first");
      return;
    }

    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleProfileComplete = () => {
    setCompletedSteps(prev => ({
      ...prev,
      profile: true
    }));
    setShowProfileForm(false);
    // Automatically open next section
    setExpandedSections(prev => ({
      ...prev,
      name: true,
      profile: false
    }));
  };

  const handleStoreCreated = () => {
    setCompletedSteps(prev => ({
      ...prev,
      storeName: true
    }));
    setShowCreateStore(false);
    // Automatically open next section
    setExpandedSections(prev => ({
      ...prev,
      product: true,
      name: false
    }));
  };

  // Show either CompleteProfile or CreateStore or main content
  if (showProfileForm) {
    return <CompleteProfile onComplete={handleProfileComplete} />;
  }

  if (showCreateStore) {
    return <CreateStore onComplete={handleStoreCreated} />;
  }

  return (
    <div className="font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        {showBanner && (
          <div className="mt-4 bg-gradient-to-r from-[var(--primary-900)] to-[var(--primary-800)] text-white p-4 flex rounded-[24px] justify-between items-center shadow-lg transform hover:scale-[1.01] transition-transform duration-200">
            <p className="text-[20px] font-[500] ml-[24px]">
              Select a plan to get 3 months for $1/month
            </p>
            <div className="flex gap-4 items-center">
              <SimpleButton
                title="Select a plan"
                className="bg-white text-[var(--primary-900)] rounded-full hover:bg-gray-100 font-semibold px-6 py-2"
              />
              <X
                className="cursor-pointer hover:text-gray-200 transition-colors"
                size={24}
                onClick={() => setShowBanner(false)}
              />
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-[42px] font-[700] text-gray-900 mb-3 bg-gradient-to-r from-[var(--primary-900)] to-[var(--primary-600)] bg-clip-text text-transparent">
              Start Selling Guide
            </h1>
            <p className="text-gray-600 text-lg">
              Complete these steps to set up your store and start selling
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className={`border border-gray-200 rounded-xl shadow-sm ${!completedSteps.profile ? 'hover:shadow-md' : ''} transition-shadow duration-200 bg-white overflow-hidden ${!completedSteps.profile ? '' : 'opacity-75'}`}>
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection("profile")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      completedSteps.profile
                        ? "bg-green-500"
                        : "bg-[var(--primary-900)]"
                    } flex items-center justify-center`}
                  >
                    {completedSteps.profile ? (
                      <CheckIcon className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">1</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Complete Personal Information
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Set up your business profile to get started
                    </p>
                  </div>
                </div>
                {expandedSections.profile ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
              {expandedSections.profile && (
                <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50">
                  <Button
                    onClick={() => setShowProfileForm(true)}
                    disabled={completedSteps.profile}
                    className="bg-[var(--primary-900)] text-white hover:bg-[var(--primary-800)] rounded-full px-8 py-3"
                  >
                    {completedSteps.profile ? "Profile Completed" : "Complete Profile"}
                  </Button>
                </div>
              )}
            </div>

            {/* Store Creation Section */}
            <div className={`border border-gray-200 rounded-xl shadow-sm ${completedSteps.profile && !completedSteps.storeName ? 'hover:shadow-md' : ''} transition-shadow duration-200 bg-white overflow-hidden ${!completedSteps.profile ? 'opacity-50' : ''}`}>
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => completedSteps.profile && toggleSection("name")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      completedSteps.storeName
                        ? "bg-green-500"
                        : "bg-[var(--primary-900)]"
                    } flex items-center justify-center`}
                  >
                    {completedSteps.storeName ? (
                      <CheckIcon className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">2</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Create Your Store
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Set up your store to personalize your brand
                    </p>
                  </div>
                </div>
                {expandedSections.name ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
              {expandedSections.name && completedSteps.profile && (
                <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50">
                  <Button
                    onClick={() => setShowCreateStore(true)}
                    disabled={!completedSteps.profile || completedSteps.storeName}
                    className="bg-[var(--primary-900)] text-white hover:bg-[var(--primary-800)] rounded-full px-8 py-3"
                  >
                    {completedSteps.storeName ? "Store Created" : "Create Store"}
                  </Button>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className={`border border-gray-200 rounded-xl shadow-sm ${completedSteps.storeName ? 'hover:shadow-md' : ''} transition-shadow duration-200 bg-white overflow-hidden ${!completedSteps.storeName ? 'opacity-50' : ''}`}>
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => completedSteps.storeName && toggleSection("product")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      completedSteps.products
                        ? "bg-green-500"
                        : "bg-[var(--primary-900)]"
                    } flex items-center justify-center`}
                  >
                    {completedSteps.products ? (
                      <CheckIcon className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">3</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Add Products to Your Store
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Add products to your store with descriptions, photos, and pricing
                    </p>
                  </div>
                </div>
                {expandedSections.product ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
              {expandedSections.product && completedSteps.storeName && (
                <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50">
                  <Button
                    onClick={() => router.push("/dashboard/product")}
                    disabled={!completedSteps.storeName}
                    className="bg-[var(--primary-900)] text-white hover:bg-[var(--primary-800)] rounded-full px-8 py-3"
                  >
                    Add Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
