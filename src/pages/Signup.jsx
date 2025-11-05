import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Mailcheck from "mailcheck";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const pendingProduct = location.state?.pendingProduct;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = ["/hair1.jpg", "/hair2.jpg", "/hair3.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // ✅ Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email address.";

 // ✅ Add Mailcheck suggestion for common typos
    Mailcheck.run({
    email: form.email,
    suggested: (suggestion) => {
      toast(`💡 Did you mean ${suggestion.full}?`, {
        icon: "📬",
      });
    },
    empty: () => {
      // No suggestion found
    },
  });

    const phoneRegex = /^\d{11}$/;
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!phoneRegex.test(form.phoneNumber))
      newErrors.phoneNumber = "Phone number must be exactly 11 digits.";

    if (!form.password.trim()) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

   
  


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error while typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // stop if errors exist

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/register", form);
      const token = response.data.data?.token|| response.data.token;
      if(!token){
        toast.error("Signup successful, but no token received from server.");
        console.error("⚠️ Signup response:", response.data);
        return;
      }

      localStorage.setItem("authToken", token);
      toast.success(response.data.message || "Account created successfully 🎉");
      // ✅ Check if user came from AddToCart
      // ✅ Handle post-signup redirection and auto-add


if (pendingProduct) {
  try {
    console.log("🛍️ Auto-adding product after signup:", pendingProduct);

    await axiosInstance.post(
      "/cart/add",
      { cartedItems: [{ itemId: pendingProduct._id, quantity: 1 }] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(`${pendingProduct.name} added to your cart 🛒`);
    
  } catch (cartError) {
    console.error("❌ Auto add to cart failed:", cartError.response?.data || cartError);
    const msg = cartError.response?.data?.message || "Signed up successfully, but failed to add item.";
    toast.error(msg);
    navigate("/", { replace: true });
  }

} 
  navigate(from, { replace: true });


      
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24 pb-20">
      <div className="min-h-[90vh] flex w-4/5 border border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Slideshow */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
          <AnimatePresence>
            <motion.img
              key={images[currentImage]}
              src={images[currentImage]}
              alt="Hair style"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-white">
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto w-full space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 pt-4">
              Create an Account 💖
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Fill in your details to get started
            </p>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#C5A572] outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#C5A572] outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#C5A572] outline-none ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#C5A572] outline-none pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5A572] text-white py-3 rounded-lg font-semibold hover:bg-[#b3925f] transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-sm text-center text-gray-600 pb-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#C5A572] font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
