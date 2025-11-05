import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Shield } from "lucide-react";

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    country: "Nigeria",
  });
  const [orderNote, setOrderNote] = useState("");
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Fetch cart & shipping rates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, shippingRes] = await Promise.all([
          axiosInstance.get("/cart/get", { headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get("/shipping/getall", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCart(cartRes.data.data);
        setShippingRates(shippingRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load checkout data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Update selected shipping
  useEffect(() => {
    if (shippingAddress.state && shippingRates.length > 0) {
      const rate = shippingRates.find(
        (r) => r.state.toLowerCase() === shippingAddress.state.toLowerCase()
      );
      setSelectedShipping(rate || null);
    }
  }, [shippingAddress.state, shippingRates]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#C5A572] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cartedItems?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <Link
            to="/collection"
            className="bg-[#C5A572] text-white px-8 py-3 rounded-lg hover:bg-[#b8945f] transition duration-300 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.cartedItems.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const shippingPrice = selectedShipping?.price || 0;
  const totalPrice = subtotal + shippingPrice;

  // Place order → initialize Paystack → redirect
  const handlePlaceOrder = async () => {
  if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.phone) {
    toast.error("Please fill in all required shipping information");
    return;
  }

  if (!selectedShipping) {
    toast.error("Please select a shipping method");
    return;
  }

  try {
    setProcessing(true);

    // 1️⃣ Prepare order data
    const orderData = {
      shippingAddress,
      paymentMethod: "Paystack",
      ...(orderNote && { orderNote })
    };

    // 2️⃣ Create order
    const orderRes = await axiosInstance.post("/orders/order", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Order response:", orderRes.data);

    const order = orderRes.data.order; // ✅ Ensure this matches your backend response
    if (!order || !order._id) {
      toast.error("Failed to create order");
      return;
    }

    // 3️⃣ Initialize Paystack payment
    const initRes = await axiosInstance.post("/orders/payment/initialize", { orderId: order._id }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const { authorization_url } = initRes.data;

    toast.success("Redirecting to Paystack...");
    localStorage.setItem("currentOrder", order._id);
    window.location.href = authorization_url; // Redirect user to Paystack checkout

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to place order");
  } finally {
    setProcessing(false);
  }
};



  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[#C5A572] hover:text-[#b8945f] mb-4 font-medium">
            <ArrowLeft size={20} /> Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Shipping */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#C5A572] rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input type="text" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent" placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <select value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent">
                      <option value="">Select State</option>
                      {shippingRates.map((rate) => <option key={rate._id} value={rate.state}>{rate.state}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent" placeholder="Phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Note (Optional)</label>
                  <textarea value={orderNote} onChange={(e) => setOrderNote(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C5A572] focus:border-transparent" placeholder="Any special instructions..." />
                </div>
              </form>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-4">
                {cart.cartedItems.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.image?.startsWith("http") ? item.image : `http://localhost:9000/${item.image?.replace(/^\/+/, "")}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₦{item.totalItemPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{selectedShipping ? <>₦{selectedShipping.price.toLocaleString()}</> : <span className="text-sm text-gray-500">Select state</span>}</span></div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span>₦{totalPrice.toLocaleString()}</span></div>
              </div>
            </div>

            {/* Secure & Place Order */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4"><Shield size={20} className="text-green-600" /><h3 className="font-semibold text-gray-800">Secure Checkout</h3></div>
              <p className="text-sm text-gray-600 mb-4">Your personal and payment information is encrypted and secure.</p>
              <button onClick={handlePlaceOrder} disabled={processing || !selectedShipping} className="w-full bg-[#C5A572] text-white py-4 rounded-lg font-semibold hover:bg-[#b8945f] disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                {processing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</> : `Place Order - ₦${totalPrice.toLocaleString()}`}
              </button>
              <Link to="/cart" className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition duration-300">
                <ArrowLeft size={18} /> Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
