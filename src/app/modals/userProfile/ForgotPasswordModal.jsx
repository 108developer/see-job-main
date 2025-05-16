"use client";

import { useSendCandidateOtpMutation } from "@/redux/api/candidateAuth";
import { useSendEmployerOtpMutation } from "@/redux/api/employerAuth";
import { setModal } from "@/redux/slices/modalSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

const ForgotPasswordModal = ({ role, closeModal }) => {
  const dispatch = useDispatch();
  const [expired, setExpired] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  const [sendCandidateOtp] = useSendCandidateOtpMutation();
  const [sendEmployerOtp] = useSendEmployerOtpMutation();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  useEffect(() => {
    let timer;
    if (!expired) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            setExpired(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expired]);

  const openOtpVerificationModal = (email) => {
    dispatch(
      setModal({
        modalType: "otpVerificationModal",
        modalProps: { email, role },
      })
    );
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let res;
      if (role === "candidate") {
        res = await sendCandidateOtp({ email: values.email }).unwrap();
      } else if (role === "employer") {
        res = await sendEmployerOtp({ email: values.email }).unwrap();
      }

      if (res.success) {
        openOtpVerificationModal(values.email);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      const msg = error?.data?.message;
      const timeLeft = error?.data?.remainingTime;

      toast.error(msg || "Failed to send OTP");

      if (
        msg === "OTP already sent. Please wait before retrying." &&
        timeLeft
      ) {
        setExpired(false);
        setRemainingTime(timeLeft);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="space-y-4 p-1">
      {/* Modal Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter your email address and we’ll send you a link to reset your
        password.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Email Input */}
            <div className="mb-6 space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="youremail@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !expired}
              className={`w-full text-white font-medium py-2 rounded-md transition ${
                isSubmitting || !expired
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting
                ? "Sending..."
                : expired
                ? "Send Reset Link"
                : `Retry in ${formatTime(remainingTime)}`}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordModal;
