import { ErrorMessage, Field } from "formik";

// Reusable RadioGroup component
export default RadioGroup = ({ label, name, options }) => (
  <div>
    <label>{label}</label>
    <div role="group" aria-labelledby={name}>
      {options.map((option) => (
        <label key={option.value}>
          <Field type="radio" name={name} value={option.value} />
          {option.label}
        </label>
      ))}
    </div>
    <ErrorMessage name={name} component="div" className="error-message" />
  </div>
);
