import React from "react";
import axiosInstance from "../api/axiosConfig";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const AddToCartButton = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { incrementCart } = useCart();

  const handleAddToCart = async () => {
    // ✅ Read token fresh on every click
    const token = localStorage.getItem("authToken");

    // 🔒 User is not logged in → redirect to login page
    if (!token) {
      toast.error("Please login to add items to your cart");
      navigate("/login", { state: { from: location, pendingProduct: product } });
      return;
    }

    try {
      console.log("🛒 Adding product:", product);

      await axiosInstance.post(
        "/cart/add",
        { cartedItems: [{ itemId: product._id, quantity: 1 }] },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ensure token is attached
          },
        }
      );

      toast.success(`${product.name} added to your cart`);
      incrementCart(1)
    } catch (error) {
      console.error("Error adding to cart:", error);

      // Specific error messages from backend
      const msg =
        error.response?.data?.message || "Failed to add item. Try again.";
      toast.error(msg);
    }
  };

  return (
    <button
  onClick={handleAddToCart}
  className="flex items-center justify-center xl:justify-start gap-1 md:gap-2 bg-[#C5A572] hover:bg-[#b8945f] text-white p-1.5 sm:p-2 md:px-4 md:py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base"
>
  <ShoppingCart size={14} sm:size={16} md:size={18} />
  <span className="hidden xl:inline">Add to Cart</span>
  <span className="hidden sm:inline xl:hidden">Add</span>
</button>
  );
};

export default AddToCartButton;
