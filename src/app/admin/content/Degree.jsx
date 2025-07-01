import { Pagination } from "@/components/Pagination";
import { Loader } from "@/components/ui/loader";
import {
  useAddDegreeMutation,
  useBulkUploadDegreesMutation,
  useDeleteDegreeMutation,
  useGetDegreesQuery,
  useUpdateDegreeMutation,
} from "@/redux/api/groupedFilterApi";
import { Edit, Plus, Trash, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import GroupedFilterValueLabel from "../editing/GroupedFilterValueLabel";

const validationSchema = Yup.object({
  label: Yup.string()
    .required("Degree label is required")
    .matches(
      /^[a-zA-Z0-9 ]+$/,
      "Degree label should only contain letters, numbers, and spaces"
    ),
  value: Yup.string().required("Degree value is required"),
});

const Degree = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetDegreesQuery({
    page: currentPage,
  });

  const [bulkUploadDegrees, { error: bulkUploadDegreesError }] =
    useBulkUploadDegreesMutation();
  const [addDegree, { error: addDegreeError }] = useAddDegreeMutation();
  const [updateDegree, { error: updateDegreeError }] =
    useUpdateDegreeMutation();
  const [deleteDegree, { error: deleteDegreeError }] =
    useDeleteDegreeMutation();

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("");
  const [editingDegree, setEditingDegree] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isBulkUploadLoading, setIsBulkUploadLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        currentPage: data.pagination?.currentPage || 1,
      });
    }
  }, [data]);

  const handleAddModalOpen = () => {
    setEditingDegree(null);
    setModalActionType("add");
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddOrUpdateOrDeleteDegree = async (values, actionType) => {
    try {
      let response;
      if (actionType === "edit" && editingDegree) {
        response = await updateDegree({
          ...editingDegree,
          label: values.label,
          value: values.value,
        });
      } else if (actionType === "add") {
        response = await addDegree({
          label: values.label,
          value: values.value,
        });
      } else if (actionType === "delete") {
        response = await deleteDegree(editingDegree._id);
      }

      if (response?.data?.success) {
        toast.success(response?.data?.message || `${actionType} successful!`);
        setIsModalOpen(false);
        refetch();
      } else {
        toast.error(response?.error?.data?.message || `${actionType} failed!`);
      }
    } catch (error) {
      console.error(`${actionType} Error:`, error);
      toast.error(`${actionType} Error!`);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsBulkUploadLoading(true);
      const response = await bulkUploadDegrees(formData).unwrap();

      if (response?.success) {
        toast.success("Bulk upload successful!");
        refetch();

        if (response.duplicates && response.duplicates.length > 0) {
          const duplicateEntries = response.duplicates
            .map((dup) => {
              return `${dup.locality} - ${dup.city}, ${dup.state} ${dup.pinCode}`;
            })
            .join(", ");
          toast.info(
            `The following records were duplicates and not added: ${duplicateEntries}`
          );
        }
      } else {
        toast.error("Bulk upload failed!");
      }
    } catch (error) {
      toast.error("An error occurred during bulk upload");
    } finally {
      setIsBulkUploadLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setSelectedFileName("");
  };

  const degrees = data?.degrees || [];
  const initialValues = {
    label: editingDegree ? editingDegree.label : "",
    value: editingDegree ? editingDegree.value : "",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <div className="text-red-500 font-bold">
          An error occurred while fetching the skills.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8 p-4">
      <div className="flex items-center justify-between text-3xl font-bold mb-6">
        <h1>Degrees</h1>

        <div className="flex items-center gap-2">
          {!selectedFile && (
            <>
              <button
                className="flex items-center text-sm gap-2 bg-blue-500 text-white px-2 py-1 rounded-md"
                onClick={handleAddModalOpen}
              >
                <Plus /> Add Degree
              </button>
              <label className="flex items-center text-sm gap-2 bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer">
                <Upload />
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                Bulk Upload
              </label>
            </>
          )}

          {selectedFile && !isUploading && (
            <div className="flex items-center gap-2">
              <span className="text-sm bg-gray-400 rounded-lg px-2 py-1">
                {selectedFileName}
              </span>
              <button
                className="bg-red-500 text-white text-xs px-2 py-1 rounded-md"
                onClick={handleCancelUpload}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md"
                onClick={handleBulkUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 mb-6">
        {degrees.length > 0 ? (
          degrees.map((degree) => (
            <div
              key={degree._id}
              className="flex justify-between items-center bg-gray-300 shadow-md rounded-lg p-4 text-center"
            >
              <div className="flex flex-col items-start w-full">
                <div className="text-sm font-bold">{degree.value}</div>
                <div className="text-xs text-gray-500">{degree.label}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setEditingDegree(degree);
                    setModalActionType("edit");
                    setIsModalOpen(true);
                  }}
                  className="text-yellow-500"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => {
                    setEditingDegree(degree);
                    setModalActionType("delete");
                    setIsModalOpen(true);
                  }}
                  className="text-red-500"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
            No degrees available
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <GroupedFilterValueLabel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          actionType={modalActionType}
          data={editingDegree}
          onAddOrUpdateOrDelete={handleAddOrUpdateOrDeleteDegree}
          error={addDegreeError || updateDegreeError || deleteDegreeError}
          validationSchema={validationSchema}
          initialValues={initialValues}
          valuePlaceholder="B. Tech"
          labelPlaceholder="Bachelor of technology"
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Degree;
