import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GroupHero from "../assets/hero.jpg"; // 🖼️ your hero image

function Hero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[90vh] flex items-center"
      style={{ backgroundImage: `url(${GroupHero})` }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text Content */}
      <div className="relative z-10 text-center w-full px-6 md:px-20">
        {/* Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg"
        >
          The Best In Human Hair 👑
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Explore our collection of luxurious wigs, bundles, and accessories —
          crafted to make every woman feel elegant and confident.
        </motion.p>

        {/* Animated Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="mt-8"
        >
          <Link
            to="/collection"
            className="bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-700 transition duration-300 shadow-md"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
