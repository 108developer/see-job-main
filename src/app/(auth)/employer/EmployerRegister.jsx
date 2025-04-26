// import { ErrorMessage, Field, Form, Formik } from "formik";
// import * as Yup from "yup";
// const BASE_URL = "http://localhost:5000";

// // Validation schema using Yup
// const validationSchema = Yup.object({
//   username: Yup.string()
//     .min(6, "Username must be at least 6 characters")
//     .required("Username is required"),
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   phone: Yup.string()
//     .min(6, "Phone number must be at least 6 characters")
//     .required("Phone number is required"),
//   password: Yup.string()
//     .min(8, "Password must be at least 8 characters")
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Passwords must match"),
//   resume: Yup.mixed()
//     .required("Resume is required")
//     .test(
//       "fileSize",
//       "File size is too large",
//       (value) => !value || value.size <= 5000000 // Max file size 5MB
//     )
//     .test(
//       "fileType",
//       "Invalid file type",
//       (value) =>
//         !value || ["application/pdf", "application/msword"].includes(value.type)
//     ),
//   profilePic: Yup.mixed()
//     .required("Profile picture is required")
//     .test(
//       "fileSize",
//       "File size is too large",
//       (value) => !value || value.size <= 2000000 // Max file size 2MB
//     )
//     .test(
//       "fileType",
//       "Invalid file type",
//       (value) =>
//         !value || ["image/jpeg", "image/png", "image/gif"].includes(value.type)
//     ),
// });

// // Initial values
// const initialValues = {
//   username: "",
//   email: "",
//   phone: "",
//   password: "",
//   confirmPassword: "",
//   resume: null,
//   profilePic: null,
// };

// const EmployerRegister = () => {
//   const handleSubmit = async (values) => {
//     const formData = new FormData();

//     for (const key in values) {
//       if (values[key] !== null && key !== "resume" && key !== "profilePic") {
//         formData.append(key, values[key]);
//       }
//     }

//     if (values.resume) formData.append("resume", values.resume);
//     if (values.profilePic) formData.append("image", values.profilePic);

//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/register`, {
//         method: "POST",
//         body: formData, 
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-full py-2">
//       <div className="w-full">
//         {/* Formik form */}
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit} // Using the handleSubmit function here
//         >
//           {({ setFieldValue }) => (
//             <Form className="space-y-4">
//               {/* Username Field */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium">
//                   Username
//                 </label>
//                 <Field
//                   type="text"
//                   id="username"
//                   name="username"
//                   className="mt-1 p-2 w-full border rounded-md"
//                 />
//                 <ErrorMessage
//                   name="username"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               <div className="flex items-center justify-between gap-2">
//                 {/* Email Field */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium">
//                     Email
//                   </label>
//                   <Field
//                     type="email"
//                     id="email"
//                     name="email"
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>

//                 {/* Phone Field */}
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium">
//                     Phone Number
//                   </label>
//                   <Field
//                     type="text"
//                     id="phone"
//                     name="phone"
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   <ErrorMessage
//                     name="phone"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center justify-between gap-2">
//                 {/* Password Field */}
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium"
//                   >
//                     Password
//                   </label>
//                   <Field
//                     type="password"
//                     id="password"
//                     name="password"
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>

//                 {/* Confirm Password Field */}
//                 <div>
//                   <label
//                     htmlFor="confirmPassword"
//                     className="block text-sm font-medium"
//                   >
//                     Confirm Password
//                   </label>
//                   <Field
//                     type="password"
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   <ErrorMessage
//                     name="confirmPassword"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>
//               </div>

//               {/* Resume Upload Field */}
//               <div>
//                 <label htmlFor="resume" className="block text-sm font-medium">
//                   Resume (PDF or DOC)
//                 </label>
//                 <input
//                   type="file"
//                   id="resume"
//                   name="resume"
//                   className="mt-1 p-2 w-full border rounded-md"
//                   accept=".pdf, .doc, .docx"
//                   onChange={(event) => {
//                     setFieldValue("resume", event.currentTarget.files[0]);
//                   }}
//                 />
//                 <ErrorMessage
//                   name="resume"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               {/* Profile Picture Upload Field */}
//               <div>
//                 <label
//                   htmlFor="profilePic"
//                   className="block text-sm font-medium"
//                 >
//                   Profile Picture (JPG, PNG, GIF)
//                 </label>
//                 <input
//                   type="file"
//                   id="profilePic"
//                   name="profilePic"
//                   className="mt-1 p-2 w-full border rounded-md"
//                   accept=".jpg, .jpeg, .png, .gif"
//                   onChange={(event) => {
//                     setFieldValue("profilePic", event.currentTarget.files[0]);
//                   }}
//                 />
//                 <ErrorMessage
//                   name="profilePic"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
//               >
//                 Register
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default EmployerRegister;
