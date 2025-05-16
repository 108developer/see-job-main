import {
  useSendCandidateOtpMutation,
  useVerifyCandidateOtpMutation,
} from "@/redux/api/candidateAuth";
import {
  useSendEmployerOtpMutation,
  useVerifyEmployerOtpMutation,
} from "@/redux/api/employerAuth";
import { setModal } from "@/redux/slices/modalSlice";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const OtpVerification = ({ email, role, closeModal }) => {
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(3 * 60 * 1000);
  const [expired, setExpired] = useState(false);

  const openResetPasswordModal = () => {
    dispatch(
      setModal({
        modalType: "resetPasswordModal",
        modalProps: { email, role },
      })
    );
  };

  const [verifyCandidateOtp] = useVerifyCandidateOtpMutation();
  const [sendCandidateOtp] = useSendCandidateOtpMutation();
  const [verifyEmployerOtp] = useVerifyEmployerOtpMutation();
  const [sendEmployerOtp] = useSendEmployerOtpMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpired(true);
    }, 3 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e, index, setFieldValue) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    const joinedOtp = newOtp.join("");
    setFieldValue("otp", joinedOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index, setFieldValue) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otpArray];

      if (otpArray[index]) {
        newOtp[index] = "";
        setOtpArray(newOtp);
        setFieldValue("otp", newOtp.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }

      e.preventDefault();
    }
  };

  const handlePaste = (e, setFieldValue) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = new Array(6).fill("");
    pasted.forEach((char, i) => {
      if (/\d/.test(char)) newOtp[i] = char;
    });
    setOtpArray(newOtp);
    setFieldValue("otp", newOtp.join(""));
    inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
    e.preventDefault();
  };

  const handleSubmit = async ({ otp }, { setSubmitting }) => {
    setErrorMessage("");
    try {
      let response;
      if (role === "candidate") {
        response = await verifyCandidateOtp({ email, otp }).unwrap();
      } else if (role === "employer") {
        response = await verifyEmployerOtp({ email, otp }).unwrap();
      }

      if (response.success) {
        openResetPasswordModal();
      } else {
        setErrorMessage(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error?.data?.message || "Something went wrong while verifying OTP."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setResendSuccess(false);
    setResending(true);

    try {
      let res;
      if (role === "canidate") {
        res = await sendCandidateOtp({ email }).unwrap();
      } else if (role === "employer") {
        res = await sendEmployerOtp({ email }).unwrap();
      }

      if (res.success) {
        setResendSuccess(true);
        setExpired(false);

        const timer = setTimeout(() => {
          setExpired(true);
        }, 3 * 60 * 1000);

        return () => clearTimeout(timer);
      } else {
        setErrorMessage("Failed to resend OTP.");
      }
    } catch (error) {
      const msg = error?.data?.message;
      const timeLeft = error?.data?.remainingTime;

      if (
        msg === "OTP already sent. Please wait before retrying." &&
        timeLeft
      ) {
        setExpired(false);
        setRemainingTime(timeLeft);

        const timer = setTimeout(() => {
          setExpired(true);
        }, timeLeft);

        setErrorMessage(msg || "Something went wrong while resending OTP.");
        return () => clearTimeout(timer);
      } else {
        setErrorMessage(msg || "Something went wrong while resending OTP.");
      }
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!expired) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            setExpired(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expired]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter the 6-digit code sent to <strong>{email}</strong>.
      </p>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, setFieldValue, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div
              className="flex items-center justify-between mb-4"
              onPaste={(e) => handlePaste(e, setFieldValue)}
            >
              {otpArray.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleInputChange(e, i, setFieldValue)}
                  onKeyDown={(e) => handleKeyDown(e, i, setFieldValue)}
                  className="w-12 h-12 text-center items-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ))}
            </div>

            {errors.otp && touched.otp && (
              <div className="text-red-500 text-sm mb-2">{errors.otp}</div>
            )}

            {errorMessage ? (
              <div className="text-red-600 text-sm mb-2">{errorMessage}</div>
            ) : resendSuccess ? (
              <div className="text-green-600 text-sm mb-2">
                OTP has been resent to your email.
              </div>
            ) : (
              ""
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="mt-4 text-sm text-gray-600 text-center">
              {expired ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-red-600 hover:underline font-medium disabled:opacity-50"
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              ) : (
                <span>Resend available in: {formatTime(remainingTime)}</span>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OtpVerification;
