import { useResetCandidatePasswordMutation } from "@/redux/api/candidateAuth";
import { useResetEmployerPasswordMutation } from "@/redux/api/employerAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

const ResetPassword = ({ email, role, closeModal }) => {
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/\d/, "Must contain a number")
      .matches(/[@$!%*?&]/, "Must contain a special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const [resetCandidatePassword] = useResetCandidatePasswordMutation();
  const [resetEmployerPassword] = useResetEmployerPasswordMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let response;
      if (role === "candidate") {
        response = await resetCandidatePassword({
          email,
          password: values.password,
        }).unwrap();
      } else if (role === "employer") {
        response = await resetEmployerPassword({
          email,
          password: values.password,
        }).unwrap();
      }

      if (response.success) {
        closeModal();
        toast.success("Password reset successfully!");
      } else {
        toast.error(
          response.message || "Something went wrong while updating password"
        );
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong while updating password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
      <p className="text-sm text-gray-600">Enter your new password below.</p>
      <p className="text-xs text-gray-600 mb-6">Email: {email}</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* New Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
