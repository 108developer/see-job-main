"use client";

import SEOModal from "@/app/modals/SEOModal";
import { useContactEnquieryMutation } from "@/redux/api/admin";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
});

export default function ContactForm() {
  const [contactEnquiery] = useContactEnquieryMutation();
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "subject", label: "Subject" },
    { name: "message", label: "Message", as: "textarea" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
  ];

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await contactEnquiery(values).unwrap();

      if (response.success) {
        toast.success(response.message || "Message sent successfully.");
        resetForm();
      } else {
        toast.error(response.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending contact enquiry:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 max-w-lg p-4">
      <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center w-full">
        Enquiry
      </h2>
      <SEOModal slug="contact" />

      <Formik
        initialValues={{
          subject: "",
          message: "",
          email: "",
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          {fields.map(({ name, label, as }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <Field
                id={name}
                name={name}
                as={as || "input"}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name={name}
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </Form>
      </Formik>
    </div>
  );
}
