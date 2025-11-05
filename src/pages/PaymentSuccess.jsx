import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { toast } from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);

        // Extract reference from URL query
        const queryParams = new URLSearchParams(location.search);
        const reference = queryParams.get("reference");
        const orderId = localStorage.getItem("currentOrder"); // orderId saved before redirect

        if (!reference || !orderId) {
          toast.error("Payment reference or order not found.");
          navigate("/cart");
          return;
        }

        // Call backend to confirm payment
        const res = await axiosInstance.post(
          "/orders/confirm-payment",
          { orderId, reference },
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );

        toast.success("Payment successful! Order confirmed.");
        // Clear local storage
        localStorage.removeItem("currentOrder");

        // Redirect to order success page
        navigate(`/order-success/${orderId}`);
      } catch (error) {
        console.error("Payment verification failed:", error);
        toast.error(error.response?.data?.message || "Payment verification failed.");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      {loading ? (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C5A572] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verifying your payment...</p>
        </div>
      ) : null}
    </div>
  );
};

export default PaymentSuccess;
