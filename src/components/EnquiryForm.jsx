"use client";
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

const EnquiryForm = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleFormVisibility = () => setIsVisible(!isVisible);

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
    <div className="flex">
      <button
        onClick={toggleFormVisibility}
        className="fixed right-0 h-fit bottom-5 w-fit p-2 text-black rounded z-[60]"
      >
        {isVisible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        )}
      </button>

      {isVisible && (
        <div className="fixed right-[50px] bottom-1 md:w-[350px]  ml-6 p-4 bg-white border border-gray-300 shadow-lg z-30 rounded-lg shadow-black/60 overflow-y-auto max-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4 text-center bg-gradient-to-b from-[#c31f1f] to-[#c3381f] bg-clip-text text-transparent border-b border-[#c3241f] pb-2">
            Enquiry
          </h2>

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
      )}
    </div>
  );
};

export default EnquiryForm;
