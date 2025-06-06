"use client";

import {
  usePostContactDataMutation,
  useUpdateContactDataMutation,
} from "@/redux/api/admin";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  address: Yup.string().required("Address is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contact: Yup.string().required("Contact number is required"),
  whatsapp: Yup.string(),
  linkedin: Yup.string().url("Invalid URL"),
  instagram: Yup.string().url("Invalid URL"),
  twitter: Yup.string().url("Invalid URL"),
  facebook: Yup.string().url("Invalid URL"),
});

const ContactModalForm = ({ data, closeModal }) => {
  const [postContactData] = usePostContactDataMutation();
  const [updateContactData] = useUpdateContactDataMutation();

  const fields = [
    { name: "address", label: "Address" },
    { name: "email", label: "Email" },
    { name: "contact", label: "Contact Number" },
    { name: "whatsapp", label: "WhatsApp" },
    { name: "linkedin", label: "LinkedIn" },
    { name: "instagram", label: "Instagram" },
    { name: "twitter", label: "Twitter" },
    { name: "facebook", label: "Facebook" },
  ];

  const initialValues = {
    address: "",
    email: "",
    contact: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    facebook: "",
  };

  useEffect(() => {
    // Effect is no longer needed when using Formik initialValues directly with enableReinitialize
  }, [data]);

  const handleSubmit = async (values) => {
    try {
      let response;
      if (data?._id) {
        response = await updateContactData({ ...values }).unwrap();
      } else {
        response = await postContactData(values).unwrap();
      }

      if (response?._id) {
        toast.success("Contact saved successfully!");
        closeModal();
        window.location.reload();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error saving contact data:", error);
    }
  };

  return (
    <Formik
      initialValues={data ? { ...initialValues, ...data } : initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col w-full p-4 space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          {data ? "Edit Contact Info" : "Add Contact Info"}
        </h2>

        {fields.map(({ name, label }) => (
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
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name={name}
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {data ? "Update" : "Save"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default ContactModalForm;
