import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { fetchCartCount, incrementCart, decrementCart, setCartCount } = useCart();
  const token = localStorage.getItem("authToken");

  // ✅ Fetch user cart
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/cart/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data.data);
      fetchCartCount(); // sync navbar
    } catch (error) {
      toast.error("Failed to load cart items");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Clear entire cart
const clearCart = async () => {
  if (!cart.cartedItems.length) return;



  try {
    // Instant UI update
    setCart({ ...cart, cartedItems: [] });
    setCartCount(0); // reset navbar count
    toast.success("Cart cleared");

    await axiosInstance.delete("/cart/clear", {
      headers: { Authorization: `Bearer ${token}` },
    });

  } catch (error) {
    console.error("Failed to clear cart:", error);
    toast.error("Failed to clear cart");
    fetchCart(); // restore if error
  }
};


  // ✅ Smooth quantity update
  const updateQuantity = async (productId, action) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axiosInstance.put(
      "/cart/update",
      { productId, action },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setCart(res.data.data); // ✅ instantly update cart UI
      fetchCartCount();       // ✅ update navbar count
    }
  } catch (err) {
    console.error("Error updating quantity:", err);
  }
};


  // ✅ Remove item (instant UI update + sync backend)
  const removeItem = async (productId) => {
  const item = cart.cartedItems.find((i) => i.productId === productId);
  const qty = item?.quantity || 0;

  // Instant UI update
  setCart((prev) => ({
    ...prev,
    cartedItems: prev.cartedItems.filter((i) => i.productId !== productId),
  }));

  decrementCart(qty);
  toast.success("Item removed");



  try {
    await axiosInstance.delete(`/cart/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCartCount();
  } catch (error) {
    console.error("Failed to remove item:", error);
    toast.error("Failed to remove item");
    fetchCart(); // restore
    fetchCartCount(); // resync
  }
};

  // ================================
  // 🧾 Render Section
  // ================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#C5A572] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cartedItems?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 pt-24 px-4">
        <div className="max-w-md w-full">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
          <Link
            to="/collection"
            className="bg-[#C5A572] text-white px-8 py-3 rounded-lg hover:bg-[#b8945f] transition duration-300 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = cart.cartedItems.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const shippingFee = totalPrice > 50000 ? 0 : 1500;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.cartedItems.length} item{cart.cartedItems.length > 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.cartedItems.map((item) => (
                  <div key={item.productId} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                    <img
  src={
    item.image?.startsWith("http")
      ? item.image
      : `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}${item.image?.startsWith("/") ? item.image : "/" + item.image}`
  }
  alt={item.name}
  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
/>
                      <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-xl font-semibold text-[#C5A572] mb-4">
                            ₦{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                            <div className="flex items-center gap-3">
                              <button
                                disabled={isUpdating}
                                onClick={() => updateQuantity(item.productId, "decrease")}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                disabled={isUpdating}
                                onClick={() => updateQuantity(item.productId, "increase")}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold text-gray-900">
                              ₦{item.totalItemPrice.toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={18} /> <span className="text-sm font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.cartedItems.length} items)</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "Free" : `₦${shippingFee.toLocaleString()}`}</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₦{(totalPrice + shippingFee).toLocaleString()}</span>
                </div>

                <Link
  to="/checkout"
  className="w-full block text-center bg-[#C5A572] text-white py-4 rounded-lg font-semibold hover:bg-[#b8945f] transition duration-300 shadow-md hover:shadow-lg"
>
  Proceed to Checkout
</Link>

                <button
  onClick={clearCart}
  className="w-full flex items-center justify-center gap-2 mt-2 border border-red-500 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition duration-300"
>
  <Trash2 size={18} /> Clear All
</button>
                <Link
                  to="/collection"
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
