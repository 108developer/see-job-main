import { X } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";

const GroupedFilterModal = ({
  isOpen,
  onClose,
  actionType,
  data,
  onAddOrUpdateOrDelete,
  error,
  placeholder,
  validationSchema,
  initialValues,
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
            ? `Edit`
            : actionType === "delete"
            ? `Delete`
            : `Add`}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              {actionType !== "delete" && (
                <>
                  <div>
                    <Field
                      type="text"
                      name="name"
                      className="border p-2 mb-2 w-full rounded-lg"
                      placeholder={placeholder}
                    />
                    <ErrorMessage
                      name="name"
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
                    name="name"
                    className="border p-2 mb-2 w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg"
                    disabled
                    value={data?.name || "No Data"}
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

export default GroupedFilterModal;
