"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button"; // Fix Button import
import SimpleButton from "@/components/common/SimpleButton";
import { StoreNameDialog } from "@/components/dashboard/StoreSetupGuide/StoreNameDialog";
import { UpdateProfileDialog } from "@/components/dashboard/StoreSetupGuide/UpdateProfileDialog";
import { CheckIcon } from "@heroicons/react/24/solid"; // Fix HeroIcons import

export default function EcommerceSetupGuide() {
  const [showBanner, setShowBanner] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    setup: true,
    profile: false,
    name: true,
    product: true,
  });
  const [isStoreNameDialogOpen, setIsStoreNameDialogOpen] = useState(false);
  const [currentStoreName, setCurrentStoreName] = useState("My Store");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    profile: false,
    storeName: false,
    products: false,
  });
  const router = useRouter();

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleProfileComplete = () => {
    setCompletedSteps((prev) => ({
      ...prev,
      profile: true,
    }));
  };

  const handleStoreNameSubmit = (name: string) => {
    setCurrentStoreName(name);
    setCompletedSteps((prev) => ({
      ...prev,
      storeName: true,
    }));
  };

  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;

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
          Start Selling Guide
        </h1>
        <p className="text-gray-600 mb-6">
          Complete these steps to set up your store and start selling
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
                  <span className="text-sm">{completedStepsCount}</span>
                </div>
                <span className="text-gray-700">of 3 tasks completed</span>
              </div>
            </div>
          )}
        </div>

        {/* Complete Profile Section */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("profile")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border ${
                  completedSteps.profile
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                } mr-3 flex items-center justify-center`}
              >
                {completedSteps.profile && (
                  <CheckIcon className="text-white w-3 h-3" />
                )}
              </div>
              <h2 className="text-[20px] font-[600]">
                Complete Personal Information
              </h2>
            </div>
            {expandedSections.profile ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.profile && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Complete your personal information before creating your store.
              </p>
              <SimpleButton
                title="Update Profile"
                onClick={() => setIsProfileDialogOpen(true)}
                className="bg-[var(--primary-900)] text-white hover:bg-white hover:text-[var(--primary-900)] rounded-full transition-colors"
              />
            </div>
          )}
        </div>

        {/* Store Name Section */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("name")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border ${
                  completedSteps.storeName
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                } mr-3 flex items-center justify-center`}
              >
                {completedSteps.storeName && (
                  <CheckIcon className="text-white w-3 h-3" />
                )}
              </div>
              <h2 className="text-[20px] font-[600]">Choose your store name</h2>
            </div>
            {expandedSections.name ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.name && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Your store's temporary name is currently {currentStoreName}. The
                store name appears in your admin and your online store.
              </p>
              <SimpleButton
                title="Choose store name"
                onClick={() => setIsStoreNameDialogOpen(true)}
                className="bg-[var(--primary-900)] text-white hover:bg-white hover:text-[var(--primary-900)] rounded-full transition-colors"
              />
            </div>
          )}
        </div>

        {/* Add Products Section */}
        <div className="border border-gray-200 rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection("product")}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full border border-gray-300 mr-3"></div>
              <h2 className="text-[20px] font-[600]">Add Products to Your Store</h2>
            </div>
            {expandedSections.product ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.product && (
            <div className="p-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                Add products to your store with descriptions, photos, and
                pricing.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/dashboard/product")}
                className="bg-[var(--primary-900)] text-white hover:bg-white hover:text-[var(--primary-900)] rounded-full"
              >
                Add Products
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Store Name Dialog */}
      <StoreNameDialog
        isOpen={isStoreNameDialogOpen}
        onClose={() => setIsStoreNameDialogOpen(false)}
        onSubmit={handleStoreNameSubmit}
      />

      {/* Update Profile Dialog */}
      <UpdateProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
        onComplete={handleProfileComplete}
      />
    </div>
  );
}
