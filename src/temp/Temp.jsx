const initiatePayment = async () => {
  const res = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 500 }), // 500 INR
  });

  const order = await res.json();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    handler: async function (response) {
      const verifyRes = await fetch("/api/payment/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });

      const verifyData = await verifyRes.json();
      alert(verifyData.message || "Payment Verified!");
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>;
