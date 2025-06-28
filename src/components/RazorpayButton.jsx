"use client";

import React from "react";
import loadRazorpayScript from "../utils/loadRazorpayScript";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";

const RazorpayButton = ({ amount }) => {
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay script");
      return;
    }

    const orderRes = await createOrder(amount).unwrap();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderRes.amount,
      currency: "INR",
      order_id: orderRes.id,
      handler: async function (response) {
        const verifyRes = await verifyPayment(response).unwrap();
        alert(verifyRes.message || "Payment verified");
      },
      prefill: {
        name: "Your Name",
        email: "email@example.com",
        contact: "9999999999",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayButton;
