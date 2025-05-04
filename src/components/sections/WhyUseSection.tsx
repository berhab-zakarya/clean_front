"use client";

import { motion } from "framer-motion";
import React from "react";

interface WhyUseProps {}

const WhyUse: React.FC<WhyUseProps> = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 ">
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 "
        >
          <div className="flex flex-col gap-6 justify-start">
          <h2 className="text-[20px]  font-normal text-[#2D2E83]">
                WHY USE ALGECOM ?
              </h2>
            <div className="flex items-center justify-between">
              <h3 className="text-[40px] font-bold  text-[#2D2E83] text-left">
                Easy, Simple,
                <br />
                Affordable
              </h3>
              <p className="text-gray-500  mt-4 max-w-2xl text-left text-[20px] font-sans">
                Our platform helps your business in managing expenses. These are
                some of the reasons why you should use our platform in managing
                business finances.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Box 1 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-[#F4F6FF] rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src="/assets/images/whysection/automatic.png"
              alt="Automatic Invoice Payment"
              className="w-full"
            />
            <div className="p-6">
              <h4 className="text-lg font-bold text-[#2D2E83] mb-2">
                Automatic Invoice Payment
              </h4>
              <p className="text-sm text-gray-600">
                No need to pay manually, we provide automatic invoice payment
                service! Set a payment schedule and you're done, it's that easy!
              </p>
            </div>
          </motion.div>

          {/* Box 2 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-[#F4F6FF] rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src="/assets/images/whysection/payment-history.png"
              alt="Clear payment history"
              className="w-full"
            />
            <div className="p-6">
              <h4 className="text-lg font-bold text-[#2D2E83] mb-2">
                Clear payment history
              </h4>
              <p className="text-sm text-gray-600">
                Still writing manual expenses? Our platform breaks down every
                expense you log down to the millisecond!
              </p>
            </div>
          </motion.div>

          {/* Box 3 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-[#F4F6FF] rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src="/assets/images/whysection/multi-card.png"
              alt="Multi-card payments"
              className="w-full"
            />
            <div className="p-6">
              <h4 className="text-lg font-bold text-[#2D2E83] mb-2">
                Use of multi-card payments
              </h4>
              <p className="text-sm text-gray-600">
                Have more than 1 bank account or credit/debit card? Our platform
                is already integrated with many banks around the world, for
                easier payments!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUse;
