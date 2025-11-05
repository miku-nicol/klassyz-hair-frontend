import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
 import axiosInstance from "../api/axiosConfig";
import toast from "react-hot-toast";

import Mailcheck from "mailcheck";

function Newsletter() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("newsletter_shown");

    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("newsletter_shown", "true");
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);


 


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    toast.error("Please enter your email address.");
    return;
  }

  // 1️⃣ Check for basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email format (e.g. example@gmail.com)");
    return;
  }

  // 2️⃣ Use Mailcheck to detect possible typos
  Mailcheck.run({
    email,
    suggested: (suggestion) => {
      toast(`Did you mean ${suggestion.full}?`, { icon: "💡" });
    },
    empty: () => {
      // No suggestion found, proceed normally
      submitEmail();
    },
  });

  // Helper function to submit the email
  async function submitEmail() {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/newsletter/subscribe", { email });

      toast.success(response.data.message || "Thank you for subscribing 💕");
      setShowPopup(false);
      setEmail("");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";

      if (error.response?.status === 409) {
        toast(message, { icon: "💌" });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }
};





  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-w-md w-full rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-lg border border-[#C5A572]/40 p-8 md:p-10"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ✖️ Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#C5A572] transition"
            >
              <X size={22} />
            </button>

            {/* ✨ Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#C5A572] to-[#e79d09] text-transparent bg-clip-text">
                Join Our Glam Club 💫
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Be the first to know about new arrivals, discounts, and styling
                tips from <span className="font-semibold">KlasszyHair</span>.
              </p>
            </div>

            {/* 💌 Input form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="flex-grow px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C5A572]/70 placeholder-gray-400 text-gray-700 bg-white/70"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#C5A572] to-[#c87d0d] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition duration-300 disabled:opacity-70"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {/* 🧴 Decorative bottom glow */}
            <div className="absolute -bottom-12 left-0 right-0 h-24 bg-gradient-to-t from-[#C5A572]/30 to-transparent blur-3xl opacity-70 pointer-events-none"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Newsletter;
