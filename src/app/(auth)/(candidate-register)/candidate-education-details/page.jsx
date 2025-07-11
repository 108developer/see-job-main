"use client";

import DegreeSearchBar from "@/components/graphql-ui/HighestQualificationDegree";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveEducationalDetailsMutation } from "@/redux/api/candidateAuth";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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
        .min(0, "Percentage must be at least 0")
        .max(100, "Percentage cannot exceed 100")
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

const initialValues = {
  educationalEntries: [
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

const CandidateEducation = () => {
  const router = useRouter();
  const [saveEducationalDetails, { isLoading }] =
    useSaveEducationalDetailsMutation();

  const { userid, token, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || role !== "candidate") {
      router.push("/");
    }
  }, [token, role, router]);

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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await saveEducationalDetails({
        candidateId: userid,
        educationalEntries: values.educationalEntries,
      }).unwrap();

      if (response.success) {
        router.push("/candidate-job-preference");
        resetForm();
        toast.success("Education Details submitted successfully!");
      } else {
        toast.error(response.message || "Saving failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Saving failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full py-6 md:px-28 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Educational Details</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={educationValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {values.educationalEntries.map((entry, index) => (
              <div key={index} className="border p-4 rounded-md space-y-4">
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
                      placeholder="Percentage"
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
                  onClick={() =>
                    handleRemoveEntry(values, setFieldValue, index)
                  }
                  className="flex items-center justify-end ml-auto gap-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}

            <div className="flex gap-4 items-center justify-between">
              <button
                type="button"
                onClick={() => handleAddEntry(values, setFieldValue)}
                className="flex items-center gap-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <PlusIcon /> Add More Qualification
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CandidateEducation;
