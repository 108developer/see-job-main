"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// import dynamic from "next/dynamic";
import axios from "axios";

// const Editor = dynamic(() => import("../../admin"), { ssr: false });

const BACKEND_URL = "http://localhost:5000";

const CandidateEmailSender = ({ candidates, closeModal }) => {
  const [emailBody, setEmailBody] = useState("");

  const initialValues = {
    subject: "",
  };

  const [isConnected, setIsConnected] = useState(false);
  const recruiterEmail = useSelector((state) => state.auth?.useremail);

  useEffect(() => {
    const checkConnection = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/recruiter/status`
      );
      const data = await res.json();
      setIsConnected(data.isEmailConnected);
    };
    checkConnection();
  }, [recruiterEmail]);

  const connectGmail = () => {
    const popup = window.open(
      `${BACKEND_URL}/auth/google`,
      "Connect Gmail",
      "width=500,height=600"
    );

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        toast.success("Gmail connected (popup closed)!");
        setIsConnected(true);
      }
    }, 1000);
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!isConnected) {
      toast.error("You must connect your Gmail first.");
      return;
    }

    if (candidates.length === 0) {
      toast.error("No candidates selected");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/send-via-gmail-api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: candidates.map((c) => c.email),
          subject: values.subject,
          body: emailBody,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Emails sent successfully!");
        resetForm();
      } else {
        toast.error(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Failed to send emails.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <div className="flex flex-col h-full space-y-8 items-center justify-center">
          <div className="text-xl font-semibold">
            Before sending mails you must connect your email with google
          </div>
          <div className="text-4xl font-bold">
            Oops!!! Your email is not connected with google
          </div>

          <button
            onClick={connectGmail}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Connect Gmail to Send Emails
          </button>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6 w-full">
              {/* Subject Field */}
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-sm font-medium mb-1">
                  Subject
                </label>
                <Field
                  name="subject"
                  type="text"
                  className="border border-gray-300 p-2 rounded"
                  placeholder="Enter email subject"
                />
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Editor Field */}
              {/* <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email Body</label>
            <Editor data={emailBody} onChange={(data) => setEmailBody(data)} />
          </div> */}

              {/* Submit and Cancel */}
              <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
                <button
                  type="button"
                  className="w-fit px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isSubmitting ? "Sending..." : "Send Email"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default CandidateEmailSender;
