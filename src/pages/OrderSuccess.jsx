import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center mt-20">Loading order...</p>;
  if (!order) return <p className="text-center mt-20">Order not found.</p>;

  const { orderItems, shippingAddress, totalPrice, paymentMethod, orderStatus, trackingNumber, invoiceUrl } = order;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        {/* Success message */}
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-700 mb-4">Thank you for your purchase.</p>
          <p className="text-gray-800 font-semibold mb-2">Order ID: {order._id}</p>
          <p className="text-gray-600 mb-2">Status: {orderStatus}</p>
          <p className="text-gray-600 mb-2">Payment Method: {paymentMethod}</p>
          {trackingNumber && <p className="text-gray-600 mb-2">Tracking Number: {trackingNumber}</p>}
          <p className="text-gray-800 font-semibold mb-2">Total: ₦{totalPrice.toLocaleString()}</p>
          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A572] underline mt-2 block"
            >
              Download Invoice
            </a>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          {orderItems.map((item) => (
            <div key={item.product} className="flex gap-4 mb-4">
              <img
  src={
    item.image
      ? item.image.startsWith("http")
        ? item.image
        : `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}/${item.image.replace(/^\/+/, "")}`
      : "/placeholder.jpg"
  }
  alt={item.name}
  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
/>

              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <p className="text-gray-700">{shippingAddress.fullName}</p>
          <p className="text-gray-700">{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state}</p>
          <p className="text-gray-700">{shippingAddress.country}</p>
          <p className="text-gray-700">Phone: {shippingAddress.phone}</p>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link
            to="/"
            className="bg-[#C5A572] text-white px-6 py-3 rounded-lg hover:bg-[#b8945f] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
