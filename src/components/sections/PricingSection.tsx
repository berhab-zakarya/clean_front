"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Mock data for pricing plans
  const pricingData:any = {
    monthly: [
      {
        id: 1,
        title: "Standard",
        badge: "Most Popular",
        description: "One request at a time. For companies who need on-going design support.",
        price: "$4.99",
        period: "monthly",
        billingFrequency: "Paid per weekly",
        features: [
          "1 request at a time",
          "Unlimited brands",
          "Average 48h delivery",
          "Dedicated designer",
          "Unlimited revisions",
          "Figma files included",
          "Royalty-free assets"
        ],
        isPopular: true
      },
      {
        id: 2,
        title: "Pro",
        badge: "Best value",
        description: "Double the requests. For companies with increasing design needs. Limited spots.",
        price: "$9.99",
        period: "monthly",
        billingFrequency: "Paid per weekly",
        features: [
          "2 requests at a time",
          "Priority support",
          "Average 24h delivery",
          "Senior designer",
          "Unlimited revisions",
          "Source files included",
          "Custom illustrations"
        ],
        isPopular: false
      },
      {
        id: 3,
        title: "Business",
        badge: "",
        description: "Perfect if you want to try the subscription out or only have a few one-off tasks.",
        price: "$19.99",
        period: "monthly",
        billingFrequency: "Paid per weekly",
        features: [
          "5 requests at a time",
          "VIP support",
          "Average 12h delivery",
          "Design team access",
          "Unlimited revisions",
          "All source files included",
          "Custom branding strategy"
        ],
        isPopular: false
      }
    ],
    yearly: [
      {
        id: 1,
        title: "Standard",
        badge: "Most Popular",
        description: "One request at a time. For companies who need on-going design support.",
        price: "$49.99",
        period: "yearly",
        billingFrequency: "Paid per weekly",
        features: [
          "1 request at a time",
          "Unlimited brands",
          "Average 48h delivery",
          "Dedicated designer",
          "Unlimited revisions",
          "Figma files included",
          "Royalty-free assets"
        ],
        isPopular: true
      },
      {
        id: 2,
        title: "Pro",
        badge: "Best value",
        description: "Double the requests. For companies with increasing design needs. Limited spots.",
        price: "$99.99",
        period: "yearly",
        billingFrequency: "Paid per weekly",
        features: [
          "2 requests at a time",
          "Priority support",
          "Average 24h delivery",
          "Senior designer",
          "Unlimited revisions",
          "Source files included",
          "Custom illustrations"
        ],
        isPopular: false
      },
      {
        id: 3,
        title: "Business",
        badge: "",
        description: "Perfect if you want to try the subscription out or only have a few one-off tasks.",
        price: "$199.99",
        period: "yearly",
        billingFrequency: "Paid per weekly",
        features: [
          "5 requests at a time",
          "VIP support",
          "Average 12h delivery",
          "Design team access",
          "Unlimited revisions",
          "All source files included",
          "Custom branding strategy"
        ],
        isPopular: false
      }
    ]
  };

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

  // Tab switch animation variants
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
            {pricingData[billingCycle].map((plan:any) => (
              <motion.div 
                key={plan.id}
                variants={cardVariants}
                whileHover="hover"
                className="border-2 border-blue-800 rounded-xl p-6 flex flex-col h-full
                  transform transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-[#2D2E83]">{plan.title}</h3>
                    {plan.badge && (
                      <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-8">
                    {plan.description}
                  </p>
                  <div className="mb-4 text-[#2D2E83]">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-lg">/{plan.period}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-8">{plan.billingFrequency}</div>
                </div>
                
                <div className="flex-grow space-y-3 mb-6 border-t pt-6">
                  {plan.features.map((feature:any, idx:number) => (
                    <div key={idx} className="flex items-center">
                      <span className="text-orange-500 mr-2 text-lg">+</span>
                      <span className="text-[#2D2E83]">{feature}</span>
                    </div>
                  ))}
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

export default Pricing