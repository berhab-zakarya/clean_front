"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, X, CheckCircle2, CircleDot, AlertCircle, Store, User, Tag, Package, Sparkles, ArrowRight, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimpleButton from "@/components/common/SimpleButton";
import { CompleteProfile } from "@/components/dashboard/StoreSetupGuide/CompleteProfile";
import { CreateStore } from "@/components/dashboard/StoreSetupGuide/CreateStore";

export default function EcommerceSetupGuide() {
  const [showBanner, setShowBanner] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    setup: true,
    profile: true,
    name: false,
    categories: false,
    product: false,
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    profile: false,
    storeName: false,
    categories: false,
    products: false,
  });

  const toast = {
    error: (message) => alert(message)
  };

  const toggleSection = (section) => {
    if (section === "name" && !completedSteps.profile) {
      toast.error("Please complete your profile first");
      return;
    }
    if (section === "categories" && !completedSteps.storeName) {
      toast.error("Please create your store first");
      return;
    }
    if (section === "product" && !completedSteps.categories) {
      toast.error("Please set up your store categories first");
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
    setExpandedSections(prev => ({
      ...prev,
      name: true,
      profile: false
    }));
  };

  const handleStoreComplete = () => {
    setCompletedSteps(prev => ({
      ...prev,
      storeName: true
    }));
    setShowStoreForm(false);
    setExpandedSections(prev => ({
      ...prev,
      categories: true,
      name: false
    }));
  };

  const router = {
    push: (path) => console.log(`Navigate to: ${path}`)
  };

  const getStepStatus = (step) => {
    if (step === "profile" && completedSteps.profile) return "completed";
    if (step === "name" && completedSteps.storeName) return "completed";
    if (step === "categories" && completedSteps.categories) return "completed";
    if (step === "product" && completedSteps.products) return "completed";
    
    if (step === "profile") return "current";
    if (step === "name" && completedSteps.profile) return "current";
    if (step === "categories" && completedSteps.storeName) return "current";
    if (step === "product" && completedSteps.categories) return "current";
    
    return "locked";
  };

  const totalCompleted = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = (totalCompleted / 4) * 100;

  const steps = [
    {
      id: 'profile',
      icon: User,
      title: 'Complete Personal Information',
      description: 'Set up your business profile with contact information and business details',
      expandedContent: 'Complete your business profile to help customers get to know your business. This information will be displayed on your store.',
      buttonText: 'Complete Your Profile',
      completedText: 'Profile Completed',
      action: () => setShowProfileForm(true)
    },
    {
      id: 'name',
      key: 'storeName',
      icon: Store,
      title: 'Create Your Store',
      description: 'Design and customize your online store with your brand colors, logo, and domain',
      expandedContent: 'Make your store unique and memorable. Choose a store name, select your branding, and customize the look and feel of your online presence.',
      buttonText: 'Create Your Store',
      completedText: 'Store Created',
      action: () => setShowStoreForm(true)
    },
    {
      id: 'categories',
      icon: Tag,
      title: 'Set Up Store Categories',
      description: 'Organize your products by creating categories and subcategories for better navigation',
      expandedContent: 'Create categories to help customers find your products easily. Add descriptions and images to make your categories more appealing and informative.',
      buttonText: 'Set Up Categories',
      completedText: 'Categories Created',
      action: () => router.push("/dashboard/categories"),
      hasExample: true
    },
    {
      id: 'product',
      key: 'products',
      icon: Package,
      title: 'Add Products to Your Store',
      description: 'Add products with high-quality photos, detailed descriptions, pricing, and inventory settings',
      expandedContent: 'Create compelling product listings with multiple images, pricing options, inventory tracking, and shipping details. The more detailed your listings, the better your sales will be.',
      buttonText: 'Add Your First Product',
      completedText: 'Products Added',
      action: () => router.push("/dashboard/product"),
      hasSecondaryButton: true
    }
  ];

  if (showProfileForm) {
    return <CompleteProfile onComplete={handleProfileComplete} />;
  }

  if (showStoreForm) {
    return <CreateStore onComplete={handleStoreComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Banner */}
        {showBanner && (
          <div className="pt-8 pb-4">
            <div className="relative bg-gradient-to-r from-[#1E3A8A] via-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-2xl border border-blue-200/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Special Launch Offer</h3>
                    <p className="text-blue-100 text-lg">Get 3 months for just $1/month when you select a plan</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                 
                  <button 
                    onClick={() => setShowBanner(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1E3A8A]/10 to-blue-600/10 px-4 py-2 rounded-full border border-[#1E3A8A]/20 mb-6">
            <Star className="h-4 w-4 text-[#1E3A8A]" />
            <span className="text-sm font-medium text-[#1E3A8A]">Setup Guide</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-[#1E3A8A] via-blue-700 to-indigo-800 bg-clip-text text-transparent leading-tight">
            Start Selling
            <span className="block text-4xl lg:text-6xl font-light text-gray-600 mt-2">in minutes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Complete these simple steps to set up your store and start selling products online. 
            We'll guide you through the entire process with our intuitive setup wizard.
          </p>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Setup Progress</h3>
              <div className="flex items-center gap-2 text-[#1E3A8A] font-semibold">
                <Clock className="h-5 w-5" />
                <span>{totalCompleted}/4 completed</span>
              </div>
            </div>
            
            <div className="relative mb-8">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1E3A8A] to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="absolute -top-1 bg-white w-5 h-5 rounded-full border-4 border-[#1E3A8A] transition-all duration-1000"
                   style={{ left: `calc(${progressPercentage}% - 10px)` }}>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isCompleted = completedSteps[step.key || step.id];
                const isCurrent = getStepStatus(step.id) === "current";
                
                return (
                  <div key={step.id} className={`text-center p-4 rounded-2xl transition-all ${
                    isCompleted ? 'bg-green-50 border-2 border-green-200' : 
                    isCurrent ? 'bg-blue-50 border-2 border-[#1E3A8A]/30' : 
                    'bg-gray-50 border-2 border-gray-200'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-[#1E3A8A] text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <IconComponent className="h-6 w-6" />}
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900">{step.title.split(' ').slice(0, 2).join(' ')}</h4>
                    <div className="text-xs text-gray-500 mt-1">Step {index + 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Steps */}
        <div className="space-y-8 pb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const status = getStepStatus(step.id);
            const isCompleted = completedSteps[step.key || step.id];
            const isExpanded = expandedSections[step.id];
            
            return (
              <div key={step.id} className={`group relative overflow-hidden transition-all duration-500 ${
                status === "completed" 
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg shadow-green-100/50" 
                  : status === "current" 
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#1E3A8A]/30 shadow-xl shadow-blue-100/50" 
                  : "bg-white border-2 border-gray-200 opacity-60"
              } rounded-3xl hover:shadow-2xl hover:scale-[1.01]`}>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div
                  className={`p-8 cursor-pointer transition-all ${
                    status === "locked" ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => toggleSection(step.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                          : status === "current"
                          ? "bg-gradient-to-br from-[#1E3A8A] to-blue-700 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-200 text-gray-500"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-8 w-8" />
                        ) : (
                          <IconComponent className="h-8 w-8" />
                        )}
                        
                        {/* Step number badge */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {step.title}
                          </h2>
                          {isCompleted && (
                            <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold border border-green-200">
                              ✓ Completed
                            </span>
                          )}
                          {status === "current" && !isCompleted && (
                            <span className="bg-blue-100 text-[#1E3A8A] text-sm px-3 py-1 rounded-full font-semibold border border-blue-200">
                              Current Step
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isExpanded ? "bg-gray-100 rotate-180" : "bg-white shadow-md"
                    }`}>
                      <ChevronDown className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </div>
                
                {/* Expanded content */}
                {isExpanded && status !== "locked" && (
                  <div className="px-8 pb-8 border-t border-gray-200/50">
                    <div className="ml-22 pt-6">
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        {step.expandedContent}
                      </p>
                      
                      {/* Example for categories */}
                      {step.hasExample && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-sm">
                          <h4 className="font-semibold text-gray-900 mb-4">Example Category</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Name:</span>
                                <span className="text-sm font-medium">Electronics</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Slug:</span>
                                <span className="text-sm font-medium">electronics</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Description:</span>
                                <span className="text-sm font-medium">Electronic devices and gadgets</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-4">
                        <Button
                          onClick={step.action}
                          disabled={isCompleted}
                          className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                            isCompleted
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#1E3A8A] to-blue-700 text-white hover:shadow-xl hover:scale-105 shadow-lg"
                          }`}
                        >
                          {isCompleted ? step.completedText : step.buttonText}
                          {!isCompleted && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                        
                        {step.hasSecondaryButton && !isCompleted && (
                          <Button
                            onClick={() => router.push("/dashboard/product/bulk-upload")}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-[#1E3A8A]/30 text-[#1E3A8A] hover:bg-blue-50 transition-all"
                          >
                            Bulk Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Success Section */}
        {Object.values(completedSteps).every(Boolean) && (
          <div className="mb-16">
            <div className="relative bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full -translate-y-32 translate-x-32"></div>
              
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-4xl font-black text-green-800 mb-4">
                  🎉 Congratulations! Your store is ready
                </h2>
                <p className="text-xl text-green-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  You've successfully completed all the necessary steps to launch your online store. You're now ready to start selling and growing your business.
                </p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Need help setting up your store?</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Our support team is available 24/7 to help you with any questions or issues you might have during the setup process.
                </p>
                <div className="flex gap-4">
                  <Button className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-xl px-6 py-3 font-semibold transition-all hover:shadow-md">
                    📚 View Tutorials
                  </Button>
                  <Button className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-xl px-6 py-3 font-semibold transition-all hover:shadow-md">
                    💬 Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}