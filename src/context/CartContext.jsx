// CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("authToken");

  const fetchCartCount = async () => {
  try {
    if (!token) return setCartCount(0);

    const res = await axiosInstance.get("/cart/get", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const items = res.data?.data?.cartedItems || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  } catch (err) {
    console.error("Failed to fetch cart count:", err);
    setCartCount(0); // reset if request fails
  }
};

  const incrementCart = (qty = 1) => setCartCount((prev) => prev + qty);
  const decrementCart = (qty = 1) =>
    setCartCount((prev) => Math.max(prev - qty, 0));

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, fetchCartCount, incrementCart, decrementCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
