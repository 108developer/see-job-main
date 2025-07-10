"use client";

import DegreeSearchBar from "@/components/graphql-ui/HighestQualificationDegree";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateEducationalDetailsMutation } from "@/redux/api/candidateAuth";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

const currentYear = new Date().getFullYear();

const YEAR_OF_PASSING_OPTIONS = Array.from({ length: 21 }, (_, i) =>
  (2025 - i).toString()
).filter((y) => parseInt(y) >= 2005);

const YEAR_RANGE_OPTIONS = Array.from(
  { length: currentYear + 5 - 2005 + 1 },
  (_, i) => (currentYear + 5 - i).toString()
);

const SHOW_BOARD_AND_MEDIUM_LEVELS = ["High School", "Intermediate"];
const SHOW_DEGREE_LEVELS = ["Diploma", "Bachelors", "Masters"];
const EDUCATION_MODES = [
  "Full-time",
  "Part-time",
  "Online / Distance Learning",
];

const EDUCATION_LEVELS = [
  "High School",
  "Intermediate",
  "Diploma",
  "Bachelors",
  "Masters",
];

const BOARDS = ["CBSE", "ICSE", "CISCE", "NIOS", "CIE", "IB"];
const MEDIUMS = ["Hindi", "English", "Other"];

const educationValidationSchema = Yup.object().shape({
  educationalEntries: Yup.array().of(
    Yup.object().shape({
      educationLevel: Yup.string().required("Education level is required"),
      highestQualification: Yup.string().when("educationLevel", {
        is: (val) => SHOW_DEGREE_LEVELS.includes(val),
        then: (schema) => schema.required("Degree is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      boardOfEducation: Yup.string().when("educationLevel", {
        is: (val) => SHOW_BOARD_AND_MEDIUM_LEVELS.includes(val),
        then: (schema) => schema.required("Board is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      medium: Yup.string().when("educationLevel", {
        is: (val) => SHOW_BOARD_AND_MEDIUM_LEVELS.includes(val),
        then: (schema) => schema.required("Medium is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      percentage: Yup.number()
        .min(0)
        .max(100)
        .required("Percentage is required"),
      yearFrom: Yup.string().when("educationLevel", {
        is: (val) => !SHOW_BOARD_AND_MEDIUM_LEVELS.includes(val),
        then: (schema) => schema.required("Start year is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      yearTo: Yup.string().when("educationLevel", {
        is: (val) => !SHOW_BOARD_AND_MEDIUM_LEVELS.includes(val),
        then: (schema) =>
          schema
            .required("End year is required")
            .test(
              "is-greater",
              "End year must be after start year",
              function (value) {
                const { yearFrom } = this.parent;
                return (
                  !yearFrom || !value || parseInt(value) > parseInt(yearFrom)
                );
              }
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
      yearOfPassing: Yup.string().when("educationLevel", {
        is: (val) => SHOW_BOARD_AND_MEDIUM_LEVELS.includes(val),
        then: (schema) => schema.required("Year of Passing is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      educationMode: Yup.string().required("Mode is required"),
    })
  ),
});

const CandidateEducation = ({ initialEducationDetails, closeModal }) => {
  const [updateEducationalDetails, { isLoading }] =
    useUpdateEducationalDetailsMutation();

  const { userid, token } = initialEducationDetails;
  const userId = userid;
  const authToken = token;

  const candidateEducation = [
    ...(initialEducationDetails?.candidateEducation || []),
  ].sort((a, b) => {
    const yearA = parseInt(a.yearTo) || 0;
    const yearB = parseInt(b.yearTo) || 0;
    return yearB - yearA;
  });

  const initialValues = {
    educationalEntries: candidateEducation.length
      ? candidateEducation
      : [
          {
            educationLevel: "",
            highestQualification: "",
            boardOfEducation: "",
            medium: "",
            percentage: "",
            yearFrom: "",
            yearTo: "",
            yearOfPassing: "",
            educationMode: "",
          },
        ],
  };

  const handleAddEntry = (values, setFieldValue) => {
    const newEntries = [
      ...values.educationalEntries,
      {
        educationLevel: "",
        highestQualification: "",
        boardOfEducation: "",
        medium: "",
        percentage: "",
        yearFrom: "",
        yearTo: "",
        yearOfPassing: "",
        educationMode: "",
      },
    ];
    setFieldValue("educationalEntries", newEntries);
  };

  const handleRemoveEntry = (values, setFieldValue, index) => {
    const updatedEntries = [...values.educationalEntries];

    if (updatedEntries.length > 1) {
      updatedEntries.splice(index, 1);
      setFieldValue("educationalEntries", updatedEntries);
    } else {
      toast.warn("At least one entry must remain.");
    }
  };

  const handleSubmit = async (values) => {
    if (!userId) {
      toast.error("User ID missing");
      return;
    }

    // ✅ Sort the entries by yearTo (most recent first)
    const sortedEntries = [...values.educationalEntries].sort((a, b) => {
      const yearA = parseInt(a.yearTo) || 0;
      const yearB = parseInt(b.yearTo) || 0;
      return yearB - yearA;
    });

    try {
      const response = await updateEducationalDetails({
        userid: userId,
        token: authToken,
        educationData: {
          educationalEntries: sortedEntries.map((entry) => ({
            ...entry,
            candidateId: userId,
          })),
        },
      }).unwrap();

      if (response.success) {
        toast.success("Education updated!");
        closeModal();
        window.location.reload();
      } else {
        toast.error(response.message || "Update failed.");
      }
    } catch (error) {
      toast.error("Error updating education");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={educationValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          {values.educationalEntries.map((entry, index) => (
            <div
              key={index}
              className="border p-4 rounded-md space-y-4 shadow-md overflow-hidden"
            >
              {/* Education Level */}
              <div>
                <label className="block text-sm font-medium">
                  Education Level
                </label>
                <Select
                  value={entry.educationLevel}
                  onValueChange={(val) =>
                    setFieldValue(
                      `educationalEntries[${index}].educationLevel`,
                      val
                    )
                  }
                >
                  <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name={`educationalEntries[${index}].educationLevel`}
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {(SHOW_DEGREE_LEVELS.includes(entry.educationLevel) ||
                SHOW_BOARD_AND_MEDIUM_LEVELS.includes(
                  entry.educationLevel
                )) && (
                <div className="flex gap-6 flex-col md:flex-row w-full">
                  {SHOW_DEGREE_LEVELS.includes(entry.educationLevel) && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium">
                        Highest Qualification
                      </label>
                      <DegreeSearchBar
                        searchTerm={entry.highestQualification}
                        onSearchChange={(term) =>
                          setFieldValue(
                            `educationalEntries[${index}].highestQualification`,
                            term
                          )
                        }
                        onDegreeSelect={(sel) =>
                          setFieldValue(
                            `educationalEntries[${index}].highestQualification`,
                            sel.label
                          )
                        }
                        setFieldValue={(field, value) =>
                          setFieldValue(
                            `educationalEntries[${index}].${field}`,
                            value
                          )
                        }
                      />
                      <ErrorMessage
                        name={`educationalEntries[${index}].highestQualification`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}

                  {SHOW_BOARD_AND_MEDIUM_LEVELS.includes(
                    entry.educationLevel
                  ) && (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium">
                          Board
                        </label>
                        <Select
                          value={entry.boardOfEducation}
                          onValueChange={(val) =>
                            setFieldValue(
                              `educationalEntries[${index}].boardOfEducation`,
                              val
                            )
                          }
                        >
                          <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent>
                            {BOARDS.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name={`educationalEntries[${index}].boardOfEducation`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium">
                          Medium
                        </label>
                        <Select
                          value={entry.medium}
                          onValueChange={(val) =>
                            setFieldValue(
                              `educationalEntries[${index}].medium`,
                              val
                            )
                          }
                        >
                          <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                            <SelectValue placeholder="Select Medium" />
                          </SelectTrigger>
                          <SelectContent>
                            {MEDIUMS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name={`educationalEntries[${index}].medium`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-6 flex-col md:flex-row">
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Percentage
                  </label>
                  <Field
                    name={`educationalEntries[${index}].percentage`}
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    min="0"
                    max="100"
                  />
                  <ErrorMessage
                    name={`educationalEntries[${index}].percentage`}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Education Mode
                  </label>
                  <Select
                    value={entry.educationMode}
                    onValueChange={(val) =>
                      setFieldValue(
                        `educationalEntries[${index}].educationMode`,
                        val
                      )
                    }
                  >
                    <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name={`educationalEntries[${index}].educationMode`}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {SHOW_BOARD_AND_MEDIUM_LEVELS.includes(entry.educationLevel) ? (
                <div className="flex-1">
                  <label className="block text-sm font-medium">
                    Year of Passing
                  </label>
                  <Select
                    value={entry.yearOfPassing}
                    onValueChange={(val) =>
                      setFieldValue(
                        `educationalEntries[${index}].yearOfPassing`,
                        val
                      )
                    }
                  >
                    <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                      <SelectValue placeholder="Year of Passing" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[180px] overflow-y-auto">
                      {YEAR_OF_PASSING_OPTIONS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name={`educationalEntries[${index}].yearOfPassing`}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              ) : (
                <div className="flex gap-6 flex-col md:flex-row">
                  <div className="flex-1 mb-auto">
                    <label className="block text-sm font-medium">Start</label>
                    <Select
                      value={entry.yearFrom}
                      onValueChange={(val) =>
                        setFieldValue(
                          `educationalEntries[${index}].yearFrom`,
                          val
                        )
                      }
                    >
                      <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[180px] overflow-y-auto">
                        {YEAR_RANGE_OPTIONS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name={`educationalEntries[${index}].yearFrom`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex-1 mb-auto">
                    <label className="block text-sm font-medium">End</label>
                    <Select
                      value={entry.yearTo}
                      onValueChange={(val) =>
                        setFieldValue(
                          `educationalEntries[${index}].yearTo`,
                          val
                        )
                      }
                    >
                      <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[180px] overflow-y-auto">
                        {YEAR_RANGE_OPTIONS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name={`educationalEntries[${index}].yearTo`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemoveEntry(values, setFieldValue, index)}
                className="flex items-center justify-end ml-auto gap-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <TrashIcon />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleAddEntry(values, setFieldValue)}
            className="flex items-center gap-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <PlusIcon /> Add
          </button>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {isLoading ? "Saving..." : "Submit All"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CandidateEducation;
