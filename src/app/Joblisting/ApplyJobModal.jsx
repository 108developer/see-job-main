// "use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useApplyToJobMutation } from "@/redux/api/jobApi";
import { useSelector } from "react-redux";

export default function ApplyJobModal({ jobId, questions, closeModal }) {
  const [applyToJob] = useApplyToJobMutation();
  const { userid } = useSelector((state) => state.auth);

  const initialValues = questions.reduce((acc, q) => {
    acc[q._id] = q.type === "multiple-choice" ? [] : "";
    return acc;
  }, {});

  const validationSchema = Yup.object(
    questions.reduce((acc, q) => {
      if (q.type === "multiple-choice") {
        acc[q._id] = Yup.array().min(1, "Please select at least one option");
      } else {
        acc[q._id] = Yup.string().required("This field is required");
      }
      return acc;
    }, {})
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("USer ID", userid);
      if (!userid) {
        toast.error("Candidate ID is missing. Please login again.");
        setSubmitting(false);
        return;
      }

      const response = await applyToJob({
        jobId,
        candidateId : userid,
        answers: values,
      }).unwrap();

      if (response.success) {
        toast.success("Application submitted!");
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
        <h2 className="text-xl font-bold mb-4">Job Application</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {questions.map((q, index) => (
                <div key={index}>
                  <p className="font-medium mb-1">{`Q${index + 1}. ${
                    q.questionText
                  }`}</p>

                  {q.type === "text" && (
                    <div>
                      <Field
                        as="textarea"
                        name={q._id}
                        rows={3}
                        placeholder="Your answer"
                        className="w-full border px-3 py-2 rounded"
                      />
                      {/* <ErrorMessage
                        name={q._id}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      /> */}
                    </div>
                  )}

                  {q.type === "single-choice" &&
                    q.options.map((opt, i) => (
                      <label key={i} className="block">
                        <Field type="radio" name={q._id} value={opt} /> {opt}
                      </label>
                    ))}

                  {q.type === "multiple-choice" &&
                    q.options.map((opt, i) => (
                      <label key={i} className="block">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={values[q._id].includes(opt)}
                          onChange={(e) => {
                            const selected = values[q._id];
                            if (e.target.checked) {
                              setFieldValue(q._id, [...selected, opt]);
                            } else {
                              setFieldValue(
                                q._id,
                                selected.filter((val) => val !== opt)
                              );
                            }
                          }}
                        />{" "}
                        {opt}
                      </label>
                    ))}

                  <ErrorMessage
                    name={q._id}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
