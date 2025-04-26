// // import {
// //   useCandidateProfileDataQuery,
// //   useUpdateCandidateProfileMutation,
// // } from "@/redux/api/authApi";
// import { useGetCandidateProfileQuery } from "@/redux/api/candidateAuth";
// import { Field, Form, Formik } from "formik";
// import { useDispatch, useSelector } from "react-redux";

// const CandidateProfileModal = ({ userid, closeModal }) => {
//   const dispatch = useDispatch();
//   const { data, isLoading, error } = useGetCandidateProfileQuery(userid);

//   const {
//     profile,
//     loading: profileLoading,
//     error: profileError,
//   } = useSelector((state) => state.candidateProfile);

//   const [updateProfile] = useUpdateCandidateProfileMutation();

//   const initialValues = {
//     username: profile?.username || "",
//     email: profile?.email || "",
//     phone: profile?.phone || "",
//     skills: profile?.skills || "",
//     location: profile?.location || "",
//     minExperience: profile?.minExperience || 0,
//     maxExperience: profile?.maxExperience || 0,
//     industry: profile?.industry || "",
//     description: profile?.description || "",
//     password: "",
//     profilePic: profile?.profilePic || "",
//     resume: profile?.resume || "",
//     company: profile?.company || "",
//     salary: profile?.salary || "",
//     period: profile?.period || 0,
//     age: profile?.age || 0,
//     language: profile?.language || [],
//     qualification: profile?.qualification || "",
//     role: profile?.role || "user",
//   };

//   const handleSubmit = async (values) => {
//     try {
//       await updateProfile({ userid, ...values });
//       closeModal();
//     } catch (err) {
//       console.error("Profile update failed:", err);
//     }
//   };

//   if (isLoading || profileLoading) return <p>Loading...</p>;
//   if (error || profileError)
//     return <p className="text-red-500">Error: {error || profileError}</p>;

//   return (
//     <div className="bg-white p-8 rounded-lg shadow-xl w-full overflow-y-auto">
//       <h2 className="text-2xl font-bold mb-4">Edit</h2>
//       <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//         {({ handleSubmit }) => (
//           <Form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="username" className="block text-gray-700">
//                 Username
//               </label>
//               <Field
//                 id="username"
//                 name="username"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-gray-700">
//                 Email
//               </label>
//               <Field
//                 id="email"
//                 name="email"
//                 type="email"
//                 className="mt-1 block w-full p-2 border rounded-md"
//                 disabled
//               />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-gray-700">
//                 Phone
//               </label>
//               <Field
//                 id="phone"
//                 name="phone"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="skills" className="block text-gray-700">
//                 Skills
//               </label>
//               <Field
//                 id="skills"
//                 name="skills"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="location" className="block text-gray-700">
//                 Location
//               </label>
//               <Field
//                 id="location"
//                 name="location"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="minExperience" className="block text-gray-700">
//                 Min Experience
//               </label>
//               <Field
//                 id="minExperience"
//                 name="minExperience"
//                 type="number"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="maxExperience" className="block text-gray-700">
//                 Max Experience
//               </label>
//               <Field
//                 id="maxExperience"
//                 name="maxExperience"
//                 type="number"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="industry" className="block text-gray-700">
//                 Industry
//               </label>
//               <Field
//                 id="industry"
//                 name="industry"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="description" className="block text-gray-700">
//                 Description
//               </label>
//               <Field
//                 id="description"
//                 name="description"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="company" className="block text-gray-700">
//                 Company
//               </label>
//               <Field
//                 id="company"
//                 name="company"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="salary" className="block text-gray-700">
//                 Salary
//               </label>
//               <Field
//                 id="salary"
//                 name="salary"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="period" className="block text-gray-700">
//                 Period
//               </label>
//               <Field
//                 id="period"
//                 name="period"
//                 type="number"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="age" className="block text-gray-700">
//                 Age
//               </label>
//               <Field
//                 id="age"
//                 name="age"
//                 type="number"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="language" className="block text-gray-700">
//                 Language
//               </label>
//               <Field
//                 id="language"
//                 name="language"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="qualification" className="block text-gray-700">
//                 Qualification
//               </label>
//               <Field
//                 id="qualification"
//                 name="qualification"
//                 type="text"
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             <div className="flex flex-col lg:flex-row gap-4 justify-between mt-4">
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md"
//               >
//                 {profileLoading ? "Updating..." : "Update Profile"}
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default CandidateProfileModal;
