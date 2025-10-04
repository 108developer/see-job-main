"use client";

import { Form, Formik, useField } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import { toast } from "react-toastify";

const GSTRateDropdown = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const gstRates = [3, 5, 10, 12, 15, 18, 20, 25];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        {...field}
        onChange={(e) => helpers.setValue(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select GST</option>
        {gstRates.map((rate) => (
          <option key={rate} value={rate}>
            {rate}%
          </option>
        ))}
      </select>

      {meta.touched && meta.error && (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

const InputField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...field}
        {...props}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {meta.touched && meta.error && (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  amount: Yup.number().min(0, "Must be positive").required("Required"),
  gst: Yup.number().min(0, "Must be positive").required("Required"),
});

const PaymentPage = () => {
  const handleSubmit = async (values, { resetForm }) => {
    const amount = parseFloat(values.amount);
    const gst = parseFloat(values.gst);
    const total = amount + (amount * gst) / 100;

    const payload = {
      ...values,
      total: total.toFixed(2),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/sendPaymentNotifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to send payment notification");

      const data = await res.json();
      console.log("✅ Payment notification sent:", data);
      resetForm();
      toast.success("Payment request sent successfully!");
    } catch (err) {
      console.error("❌ Error sending payment request:", err);
      toast.error("Failed to send payment request.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">Send Payment Request</h1>
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          description: "",
          amount: "",
          gst: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          const amount = parseFloat(values.amount) || 0;
          const gst = parseFloat(values.gst) || 0;
          const total = amount + (amount * gst) / 100;

          return (
            <Form className="space-y-4 border rounded-lg shadow-lg p-8">
              <InputField label="Name" name="name" />

              <InputField label="Email" name="email" type="email" />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Phone / WhatsApp
                </label>
                <PhoneInput
                  country={"in"}
                  value={values.phone}
                  onChange={(value) => setFieldValue("phone", `+${value}`)}
                  inputClass="w-full"
                  containerClass="w-full"
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                    paddingLeft: "48px",
                  }}
                />
              </div>

              <InputField label="Amount (₹)" name="amount" type="number" />
              <GSTRateDropdown label="GST (%)" name="gst" />

              <InputField label="Description" name="description" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-lg font-semibold">
                  Total : ₹ {isNaN(total) ? "0.00" : total.toFixed(2)}
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Send Payment Request
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PaymentPage;
