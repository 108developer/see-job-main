// import { ErrorMessage } from "formik";

// export const ExperienceDropdown = ({
//   label,
//   id,
//   value,
//   setValue,
//   options,
//   disabled,
// }) => {
//   const handleSelect = (e) => {
//     setValue(e.target.value);
//   };

//   return (
//     <div className="flex items-center w-full">
//       <div
//         htmlFor={id}
//         className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200"
//       >
//         {label}
//       </div>

//       <select
//         id={id}
//         name={id}
//         className="p-3 w-full border rounded-r-md"
//         value={value}
//         onChange={handleSelect}
//         disabled={disabled}
//       >
//         <option value="">Select</option>
//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option} years
//           </option>
//         ))}
//       </select>
//       <ErrorMessage
//         name={id}
//         component="div"
//         className="text-red-500 text-sm mt-1"
//       />
//     </div>
//   );
// };
