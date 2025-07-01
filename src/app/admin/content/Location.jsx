import { Pagination } from "@/components/Pagination";
import { Loader } from "@/components/ui/loader";
import {
  useAddLocationMutation,
  useBulkUploadLocationsMutation,
  useDeleteLocationMutation,
  useGetLocationsQuery,
  useUpdateLocationMutation,
} from "@/redux/api/groupedFilterApi";
import { Edit, Plus, Trash, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import LocationModal from "../editing/LocationModal";

const validationSchema = Yup.object({
  locality: Yup.string().required("Locality is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, "Pin code must be 6 digits")
    .required("Pin Code is required"),
});

const Location = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetLocationsQuery({
    page: currentPage,
  });

  const [bulkUploadLocations, { error: bulkUploadLocationsError }] =
    useBulkUploadLocationsMutation();
  const [addLocation, { error: addLocationError }] = useAddLocationMutation();
  const [updateLocation, { error: updateLocationError }] =
    useUpdateLocationMutation();
  const [deleteLocation, { error: deleteLocationError }] =
    useDeleteLocationMutation();

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("");
  const [editingLocation, setEditingLocation] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isBulkUploadLoading, setIsBulkUploadLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setPagination({
        totalPages: data?.totalPages || 1,
        currentPage: data?.currentPage || 1,
      });
    }
  }, [data]);

  const handleAddModalOpen = () => {
    setEditingLocation(null);
    setModalActionType("add");
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddOrUpdateOrDeleteLocation = async (values, actionType) => {
    try {
      let response;
      if (actionType === "edit" && editingLocation) {
        response = await updateLocation({
          _id: editingLocation._id,
          locality: values.locality,
          city: values.city,
          state: values.state,
          country: values.country,
          pinCode: values.pinCode,
        });
      } else if (actionType === "add") {
        response = await addLocation({
          locality: values.locality,
          city: values.city,
          state: values.state,
          country: values.country,
          pinCode: values.pinCode,
        });
      } else if (actionType === "delete") {
        response = await deleteLocation(editingLocation._id);
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
      setIsUploading(true);
      const response = await bulkUploadLocations(formData).unwrap();

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
      setIsUploading(false);
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

  const locations = data?.locations || [];
  const initialValues = {
    locality: editingLocation ? editingLocation.locality : "",
    city: editingLocation ? editingLocation.city : "",
    state: editingLocation ? editingLocation.state : "",
    country: editingLocation ? editingLocation.country : "",
    pinCode: editingLocation ? editingLocation.pinCode : "",
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
        <h1>Locations</h1>
        {/* // ADD THIS */}
        <div className="flex items-center gap-2">
          {!selectedFile && (
            <>
              <button
                className="flex items-center text-sm gap-2 bg-blue-500 text-white px-2 py-1 rounded-md"
                onClick={handleAddModalOpen}
              >
                <Plus /> Add Location
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

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Locality</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">Country</th>
              <th className="px-4 py-2 text-left">Pin Code</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length > 0 ? (
              locations.map((location) => (
                <tr key={location._id} className="border-b">
                  <td className="px-4 py-2">{location.locality}</td>
                  <td className="px-4 py-2">{location.city}</td>
                  <td className="px-4 py-2">{location.state}</td>
                  <td className="px-4 py-2">{location.country}</td>
                  <td className="px-4 py-2">{location.pinCode}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditingLocation(location);
                        setModalActionType("edit");
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-500"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => {
                        setEditingLocation(location);
                        setModalActionType("delete");
                        setIsModalOpen(true);
                      }}
                      className="text-red-500"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No Locations available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          actionType={modalActionType}
          data={editingLocation}
          onAddOrUpdateOrDelete={handleAddOrUpdateOrDeleteLocation}
          error={addLocationError || updateLocationError || deleteLocationError}
          validationSchema={validationSchema}
          initialValues={initialValues}
          valuePlaceholder="Enter Location"
          labelPlaceholder="Enter location details"
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Location;
