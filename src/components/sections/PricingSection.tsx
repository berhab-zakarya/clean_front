"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { usePlans } from "@/hooks/usePlans";

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { plans, loading, error } = usePlans();

  // Filter plans based on billing cycle
  const filteredPlans = plans.filter(plan => plan.frequency === billingCycle);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const tabContentVariants = {
    hidden: { 
      opacity: 0,
      x: billingCycle === "monthly" ? -20 : 20
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      x: billingCycle === "monthly" ? 20 : -20,
      transition: {
        duration: 0.3
      }
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <div className="text-[#2D2E83]">Loading plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 flex justify-center items-center">
        <div className="text-red-500">Error loading plans: {error.message}</div>
      </div>
    );
  }

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-16"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col gap-6 justify-start">
            <h2 className="text-[20px] font-normal text-[#2D2E83]">
              PRICING
            </h2>
            <div className="flex items-center justify-between">
              <h3 className="text-[40px] font-bold text-[#2D2E83] text-left">
                Simple, As free
                <br />
                Great
              </h3>
              <p className="text-gray-500 mt-4 max-w-2xl text-left text-[20px] font-sans">
                Senior experts. On-demand requests. Fast turnarounds. Flat monthly fee.
                Cancel anytime.
              </p>
            </div>
          </div>
        </motion.div>
       
        {/* Billing toggle */}
        <div className="flex justify-center mb-8 relative">
          <div className="bg-gray-100 rounded-full flex items-center p-1 w-72">
            <button 
              className={`flex-1 py-2 px-4 rounded-full text-center ${billingCycle === "monthly" ? "bg-orange-500 text-white" : ""}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-full text-center ${billingCycle === "yearly" ? "bg-white text-[#2D2E83]" : ""}`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </button>
          </div>
          <div className="absolute right-1/2 -mr-32 md:right-auto md:left-1/2 md:ml-20 top-0 bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
            Save 40%
          </div>
        </div>
        
        {/* Pricing cards */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={billingCycle}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {filteredPlans.map((plan) => (
              <motion.div 
                key={plan.id}
                variants={cardVariants}
                whileHover="hover"
                className="border-2 border-blue-800 bg-white rounded-xl p-6 flex flex-col h-full transition-all duration-300 translate-y-1 shadow-[0px_5px_0px_0px_#1E3A8A]"
              >
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-[#2D2E83]">{plan.name}</h3>
                    {(plan.is_popular || plan.is_best_value) && (
                      <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {plan.is_popular ? 'Most Popular' : 'Best Value'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-8">
                    {plan.description}
                  </p>
                  <div className="mb-4 text-[#2D2E83]">
                    <span className="text-4xl font-bold">{plan.price} DZD</span>
                    <span className="text-lg">/{plan.frequency}</span>
                  </div>
                </div>
                
                <div className="flex-grow space-y-3 mb-6 border-t pt-6">
                  {Array.isArray(plan.features) ? (
                    plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-orange-500 mr-2 text-lg">+</span>
                        <span className="text-[#2D2E83]">
                          {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-2 text-lg">+</span>
                      <span className="text-[#2D2E83]">
                        {String(plan.features)}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button className="w-full">Subscribe</Button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default Pricing;