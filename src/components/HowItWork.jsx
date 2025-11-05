import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaShoppingBag, FaTruck } from "react-icons/fa";

function HowItWork() {
  const steps = [
    {
      icon: <FaSearch className="text-[#C5A572] text-4xl" />,
      title: "1. Browse Our Collection",
      description:
        "Explore our premium selection of 100% human hair wigs, bundles, and accessories.",
    },
    {
      icon: <FaShoppingBag className="text-[#C5A572] text-4xl" />,
      title: "2. Place Your Order",
      description:
        "Choose your favorite style and make your order securely through our online store.",
    },
    {
      icon: <FaTruck className="text-[#C5A572] text-4xl" />,
      title: "3. Fast Delivery",
      description:
        "We ship your order quickly, right to your doorstep, with care and quality guaranteed.",
    },
  ];

  return (
    <motion.section
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(197, 165, 114, 0.3)",
              }}
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0.6, y: 20, opacity: 0 }}
                whileInView={{ scale: 1, y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 150,
                  damping: 8,
                }}
                className="flex justify-center items-center w-16 h-16 bg-[#C5A572]/10 rounded-full mb-4"
              >
                {step.icon}
              </motion.div>

              {/* Step Content */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default HowItWork;
