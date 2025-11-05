import React from 'react';
import { motion } from "framer-motion";
import aboutImage from "../assets/aboutuss.png";

function About() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        {/* 🖼️ Image Section (Slide in from Left) */}
        <div className="flex justify-center overflow-hidden">
          <motion.img
            src={aboutImage}
            alt="About KlassyzHair_Plugg"
            className="rounded-3xl shadow-xl object-cover w-full max-w-md border-4 border-[#C5A572]"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ amount: 0.4 }}
          />
        </div>

        {/* 📝 Text Section (Slide in Smoothly from Right) */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ amount: 0.4 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              About <span className="text-[#C5A572]">KlassyzHair_Plugg</span>
            </h2>
            <div className="w-20 h-1 bg-[#C5A572] mb-6"></div>

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              KlassyzHair_Plugg is your go-to destination for luxury human hair
              wigs, bundles, and accessories designed to make every woman feel
              confident and radiant. Our brand celebrates beauty, elegance, and
              self-expression through quality craftsmanship and care.
            </p>

            <p className="text-gray-600 text-base mb-8 leading-relaxed">
              Each piece in our collection is sourced ethically and crafted for
              durability, softness, and natural appeal — ensuring you always feel
              beautiful, bold, and empowered. We don’t just sell hair — we sell
              confidence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
