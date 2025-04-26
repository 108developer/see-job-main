// // app/profile/[useremail]/ProfileModal.jsx
// "use client";

// import { useFormik } from "formik";
// import { useUpdateProfileMutation } from "@/redux/services/profileApi";
// import * as Yup from "yup";
// import { useState } from "react";

// // Formik validation schema using Yup
// const validationSchema = Yup.object({
//   username: Yup.string().required("Username is required"),
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   phone: Yup.string(),
//   location: Yup.string(),
//   skills: Yup.string(),
//   industry: Yup.string(),
//   description: Yup.string(),
//   company: Yup.string(),
//   salary: Yup.string(),
// });

// const ProfileModal = ({ profileData, useremail, onClose }) => {
//   const [updateProfile, { isLoading }] = useUpdateProfileMutation();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Formik setup
//   const formik = useFormik({
//     initialValues: profileData,
//     validationSchema,
//     onSubmit: async (values) => {
//       setIsSubmitting(true);

//       try {
//         // Send the updated profile data to the server using RTK Query
//         await updateProfile({ useremail, profileData: values }).unwrap();
//         alert("Profile updated successfully");
//         onClose(); // Close the modal on success
//       } catch (error) {
//         console.error("Error updating profile:", error);
//         alert("Failed to update profile");
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//   });

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Edit Profile</h2>
//         <form onSubmit={formik.handleSubmit}>
//           <div>
//             <label htmlFor="username">Username</label>
//             <input
//               id="username"
//               name="username"
//               type="text"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.username}
//             />
//             {formik.touched.username && formik.errors.username && (
//               <div>{formik.errors.username}</div>
//             )}
//           </div>

//           <div>
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <div>{formik.errors.email}</div>
//             )}
//           </div>

//           {/* Add more fields as needed */}

//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Updating..." : "Update Profile"}
//           </button>
//         </form>
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default ProfileModal;
