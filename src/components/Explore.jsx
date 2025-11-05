import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import wigImg from "../assets/wig.jpg";
import bundlesImg from "../assets/bundles.jpg";
import accesImg from "../assets/access.jpg";

function Explore() {
  const collections = [
    {
      name: "Wigs",
      image: wigImg,
      link: "/collection/wig",
    },
    {
      name: "Bundles",
      image: bundlesImg,
      link: "/collection/bundle",
    },
    {
      name: "Accessories",
      image: accesImg,
      link: "/accessories",
    },
  ];

  return (
    <motion.section
      className="py-16 bg-gray-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Collections
        </motion.h2>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {collections.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <Link
                to={item.link}
                className="block group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 bg-white"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300"></div>
                  <h3 className="absolute bottom-6 left-6 text-2xl font-semibold text-white drop-shadow-lg">
                    {item.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default Explore;
