"use client";

import { useDispatch } from "react-redux";
import { setModal } from "@/redux/slices/modalSlice";
import { Edit } from "lucide-react";

const SHOW_BOARD_AND_MEDIUM_LEVELS = ["High School", "Intermediate"];
const SHOW_DEGREE_LEVELS = ["Diploma", "Bachelors", "Masters"];

const CandidateEducationDetails = ({ initialEducationDetails }) => {
  const dispatch = useDispatch();

  const { candidateEducation = [] } = initialEducationDetails;

  const openEducationDetailsModal = () => {
    dispatch(
      setModal({
        modalType: "educationDetailsModal",
        modalProps: {
          initialEducationDetails,
        },
      })
    );
  };

  const getValue = (value) =>
    value !== undefined && value !== null && value !== ""
      ? value
      : "Not Available";

  const sortedEducation = [...candidateEducation].sort((a, b) => {
    const yearA = parseInt(a.yearTo) || 0;
    const yearB = parseInt(b.yearTo) || 0;
    return yearB - yearA;
  });

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Candidate Education Details</h1>
        <div className="flex">
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={openEducationDetailsModal}
          />
        </div>
      </div>

      {/* Education Entries */}
      {sortedEducation.length > 0 ? (
        sortedEducation.map((edu, index) => (
          <div
            key={edu._id || index}
            className="flex flex-col space-y-4 border-b pb-4 mb-4"
          >
            <div className="flex flex-col md:flex-row gap-2 justify-between">
              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700">
                  Education Level
                </label>
                <div className="text-gray-500">
                  {getValue(edu.educationLevel)}
                </div>
              </div>

              {SHOW_DEGREE_LEVELS.includes(edu.educationLevel) && (
                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Highest Qualification
                  </label>
                  <div className="text-gray-500">
                    {getValue(edu.highestQualification)}
                  </div>
                </div>
              )}

              {SHOW_BOARD_AND_MEDIUM_LEVELS.includes(edu.educationLevel) && (
                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Year of Passing
                  </label>
                  <div className="text-gray-500">
                    {getValue(edu.yearOfPassing)}
                  </div>
                </div>
              )}
            </div>

            {/* <div className="flex flex-col w-full gap-2 justify-between">
              <label className="text-sm font-semibold text-gray-700">
                College/University
              </label>
              <div className="text-gray-500">
                {getValue(edu.boardOfEducation)}
              </div>
            </div> */}

            {SHOW_BOARD_AND_MEDIUM_LEVELS.includes(edu.educationLevel) && (
              <div className="flex flex-col md:flex-row gap-2 justify-between">
                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Board of Education
                  </label>
                  <div className="text-gray-500">
                    {getValue(edu.boardOfEducation)}
                  </div>
                </div>

                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Medium
                  </label>
                  <div className="text-gray-500">{getValue(edu.medium)}</div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2 justify-between">
              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700">
                  Education Mode
                </label>
                <div className="text-gray-500">
                  {getValue(edu.educationMode)}
                </div>
              </div>

              <div className="w-full">
                <label className="text-sm font-semibold text-gray-700">
                  Percentage
                </label>
                <div className="text-gray-500">{getValue(edu.percentage)}%</div>
              </div>
            </div>

            {SHOW_DEGREE_LEVELS.includes(edu.educationLevel) && (
              <div className="flex flex-col md:flex-row gap-2 justify-between">
                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    Start
                  </label>
                  <div className="text-gray-500">{getValue(edu.yearFrom)}</div>
                </div>

                <div className="w-full">
                  <label className="text-sm font-semibold text-gray-700">
                    End
                  </label>
                  <div className="text-gray-500">{getValue(edu.yearTo)}</div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No education details available.</p>
      )}
    </div>
  );
};

export default CandidateEducationDetails;
