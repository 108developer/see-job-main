import { Pagination } from "@/components/Pagination";
import { Loader } from "@/components/ui/loader";
import {
  useAddSkillMutation,
  useBulkUploadSkillsMutation,
  useDeleteSkillMutation,
  useGetSkillsQuery,
  useUpdateSkillMutation,
} from "@/redux/api/groupedFilterApi";
import { Edit, Plus, Trash, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import GroupedFilterModal from "../editing/GroupedFilterModal";
import BulkUploadSkillsModal from "../editing/BulkUploadSkillsModal";

const validationSchema = Yup.object({
  name: Yup.string().required("Skill name is required"),
});

const Skills = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetSkillsQuery({
    page: currentPage,
  });

  const [bulkUploadSkills, { error: bulkUploadSkillsError }] =
    useBulkUploadSkillsMutation();
  const [addSkill, { error: addSkillError }] = useAddSkillMutation();
  const [updateSkill, { error: updateSkillError }] = useUpdateSkillMutation();
  const [deleteSkill, { error: deleteSkillError }] = useDeleteSkillMutation();

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
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
    setEditingSkill(null);
    setModalActionType("add");
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddOrUpdateorDeleteSkill = async (values, actionType) => {
    try {
      let response;
      if (actionType === "edit" && editingSkill) {
        response = await updateSkill({ ...editingSkill, name: values.name });
      } else if (actionType === "add") {
        response = await addSkill({ name: values.name });
      } else if (actionType === "delete") {
        response = await deleteSkill(editingSkill._id);
      } else {
        ("");
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
      const response = await bulkUploadSkills(formData).unwrap();

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
        toast.error(response?.message || "Bulk upload failed!");
      }
    } catch (error) {
      toast.error("An error occurred during bulk upload");
    } finally {
      setIsBulkUploadLoading(false);
    }
  };

  const handleBulkUploadSubmit = async ({ paragraph }) => {
    try {
      const response = await bulkUploadSkills({
        skills: paragraph,
      }).unwrap();

      if (response?.success) {
        toast.success("Bulk upload successful!");
        refetch();

        if (response?.duplicates?.length > 0) {
          const duplicates = response.duplicates.join(", ");
          toast.info(`Duplicates not added: ${duplicates}`);
        }

        setIsBulkModalOpen(false);
      } else {
        toast.error("Bulk upload failed.");
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("An error occurred during bulk upload.");
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

  const skills = data?.skills || [];
  const initialValues = { name: editingSkill ? editingSkill.name : "" };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  if (isBulkUploadLoading) {
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
        <h1>Skills</h1>
        <div className="flex items-center gap-2">
          {!selectedFile && (
            <>
              <button
                className="flex items-center text-sm gap-2 bg-blue-500 text-white px-2 py-1 rounded-md"
                onClick={handleAddModalOpen}
              >
                <Plus /> Add Skill
              </button>
              <button
                className="flex items-center text-sm gap-2 bg-green-500 text-white px-2 py-1 rounded-md"
                onClick={() => setIsBulkModalOpen(true)}
              >
                <Upload />
                Bulk Upload
              </button>
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

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 mb-6">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill._id}
              className="flex justify-between items-center bg-gray-300 shadow-md rounded-lg p-4 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="font-bold">{skill.name}</div>
                <div className="text-sm text-gray-500">{skill.level}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setModalActionType("edit");
                    setIsModalOpen(true);
                  }}
                  className="text-yellow-500"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => {
                    setEditingSkill(skill);
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
            No skills available
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <GroupedFilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          actionType={modalActionType}
          data={editingSkill}
          onAddOrUpdateOrDelete={handleAddOrUpdateorDeleteSkill}
          error={addSkillError || updateSkillError || deleteSkillError}
          placeholder="Enter Skill Name"
          validationSchema={validationSchema}
          initialValues={initialValues}
        />
      )}

      <BulkUploadSkillsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkUploadSubmit}
      />

      <ToastContainer />
    </div>
  );
};

export default Skills;
