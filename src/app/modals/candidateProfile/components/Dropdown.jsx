import { ErrorMessage } from "formik";

export const Dropdown = ({ label, id, value, setValue, options, disabled }) => {
  // Handles selecting a value and updating the form field
  const handleSelect = (e) => {
    setValue(e.target.value); // Set selected value in Formik state
  };

  return (
    <div className="flex items-center w-full">
      {/* Label */}
      <div
        htmlFor={id}
        className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200"
      >
        {label}
      </div>

      {/* Dropdown */}
      <select
        id={id}
        name={id}
        className="p-3 w-full border rounded-r-md"
        value={value}
        onChange={handleSelect}
        disabled={disabled}
      >
        <option value="">Select</option> {/* Placeholder option */}
        {options.map((option) => (
          <option key={option} value={option}>
            {option} {/* Display the option value */}
          </option>
        ))}
      </select>

      {/* Validation error message */}
      <ErrorMessage
        name={id}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};
