import { X } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";

const GroupedFilterValueLabel = ({
  isOpen,
  onClose,
  actionType,
  data,
  onAddOrUpdateOrDelete,
  error,
  validationSchema,
  initialValues,
  valuePlaceholder,
  labelPlaceholder,
}) => {
  const handleSubmit = async (values) => {
    onAddOrUpdateOrDelete(values, actionType);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 overflow-hidden min-h-screen">
      <div className="bg-white p-8 gap-8 rounded-lg shadow-lg min-w-[300px] md:min-w-[520px] lg:min-w-[720px] max-w-[720px] relative max-h-[90vh] flex flex-col">
        <button
          className="absolute top-1 right-1 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {actionType === "edit"
            ? `Edit Job Title`
            : actionType === "delete"
            ? `Delete Job Title`
            : `Add Job Title`}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {actionType !== "delete" && (
                <>
                  <div>
                    <Field
                      type="text"
                      name="value"
                      className="border p-2 mb-2 w-full rounded-lg"
                      placeholder={valuePlaceholder || "Enter value"}
                    />
                    <ErrorMessage
                      name="value"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Field
                      type="text"
                      name="label"
                      className="border p-2 mb-2 w-full rounded-lg"
                      placeholder={labelPlaceholder || "Enter label"}
                    />
                    <ErrorMessage
                      name="label"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </>
              )}

              {actionType === "delete" && (
                <div>
                  <Field
                    type="text"
                    name="label"
                    className="border p-2 mb-2 w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg"
                    disabled
                    value={data?.label || "No Data"}
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                {actionType === "delete" ? (
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={isSubmitting}
                  >
                    {actionType === "edit" ? `Update` : `Add`}
                  </button>
                )}
              </div>

              {error && <div className="text-red-500">{error.message}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default GroupedFilterValueLabel;
