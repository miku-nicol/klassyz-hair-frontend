import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const pendingProduct = location.state?.pendingProduct;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔹 Basic client-side validation
  if (!email || !password) {
    toast.error("Please fill in all fields.");
    return;
  }

  // 🔹 Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  // 🔹 Password length check
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return;
  }

  // ✅ If all checks pass, proceed to API call
  setLoading(true);

  


  try {
    const response = await axiosInstance.post("/user/login", { email, password });
    toast.success(response.data.message || "Login successful 🎉");

    const token = response.data.accessToken || response.data.token;
    localStorage.setItem("authToken", token);

 // 🔹 Auto-add pending product to cart (if any)
  
  if (pendingProduct) {
  try {
    await axiosInstance.post(
      "/cart/add",
      { cartedItems: [{ itemId: pendingProduct._id, quantity: 1 }] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(`${pendingProduct.name} added to your cart`);
  } catch (error) {
    console.error("Auto-add to cart failed:", error);
    toast.error(
      error.response?.data?.message || "Could not add item to cart automatically."
    );
  }
}


    // ✅ Redirect user
    navigate(from, { replace: true });

  } catch (error) {
    const msg = error.response?.data?.message || "Login failed.";
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

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-white">
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto w-full space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 pt-4">
              Welcome Back ✨
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Please log in to continue
            </p>

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
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#C5A572] outline-none"
                required
              />
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#C5A572] outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-sm text-center text-gray-600 pb-5">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                state={{
    from: location.state?.from,
    pendingProduct: location.state?.pendingProduct,}}

                className="text-[#C5A572] font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Login;
