import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosConfig";
import Logo from "../assets/Logo.png";
import Mailcheck from "mailcheck";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

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
      
      setEmail("");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";

      if (error.response?.status === 409) {
        toast(message, { icon: "💌" });
      } else if (error.response?.status === 400) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }
};

  return (
    <footer className="bg-[#111] text-gray-300 pt-16 pb-8 border-t-2 border-[#C5A572] overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 border-t border-gray-800 pt-10">
        {/* 🌸 Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src={Logo}
            alt="KlassyzHair_Plugg Logo"
            className="h-20 mb-4 hover:scale-105 transition-transform duration-300"
          />
          <p className="text-sm leading-relaxed text-gray-400">
            KlassyzHair_Plugg — redefining beauty with luxury, quality, and
            confidence. Explore our premium human hair wigs, bundles, and
            accessories that let your true beauty shine.
          </p>
        </motion.div>

        {/* 🧭 Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-[#C5A572] mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Collection", "Accessories", "Cart", "About Us"].map(
              (link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5, color: "#C5A572" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Link
                    to={
                      link === "Home"
                        ? "/"
                        : `/${link.toLowerCase().replace(" ", "")}`
                    }
                  >
                    {link}
                  </Link>
                </motion.li>
              )
            )}
          </ul>
        </motion.div>

        {/* 📨 Newsletter + Socials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-[#C5A572] mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to get exclusive offers and hair care tips from
            <span className="text-[#C5A572] font-medium">
              {" "}
              KlassyzHair_Plugg
            </span>
            .
          </p>

          <motion.form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center gap-3 mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C5A572]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C5A572] hover:bg-[#b3925f] text-white px-6 py-3 rounded-full font-medium transition duration-300 disabled:opacity-70"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </motion.form>

          <div className="flex space-x-4 mt-4">
            {[FaFacebookF, FaInstagram, FaTwitter, FaTiktok].map(
              (Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, color: "#C5A572" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={18} />
                </motion.a>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* ⚖️ Bottom Line */}
      <motion.div
        className="border-t border-gray-800 text-center pt-6 mt-10 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        © {new Date().getFullYear()} KlassyzHair_Plugg. All rights reserved.
      </motion.div>
    </footer>
  );
}

export default Footer;
