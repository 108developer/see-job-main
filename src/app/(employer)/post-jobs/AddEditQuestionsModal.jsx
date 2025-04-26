"use client";

import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const AddEditQuestionsModal = ({
  closeModal,
  questions = [],
  setQuestions,
}) => {
  const [editableQuestions, setEditableQuestions] = useState([]);

  useEffect(() => {
    setEditableQuestions(
      questions.length > 0
        ? questions
        : [{ questionText: "", type: "text", options: [] }]
    );
  }, [questions]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...editableQuestions];
    updated[index][field] = value;
    if (field === "type" && value === "text") {
      updated[index].options = [];
    }
    setEditableQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...editableQuestions];
    updated[qIndex].options[oIndex] = value;
    setEditableQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...editableQuestions];
    updated[qIndex].options.push("");
    setEditableQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...editableQuestions];
    updated[qIndex].options.splice(oIndex, 1);
    setEditableQuestions(updated);
  };

  const addQuestion = () => {
    setEditableQuestions([
      ...editableQuestions,
      { questionText: "", type: "text", options: [] },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...editableQuestions];
    updated.splice(index, 1);
    setEditableQuestions(updated);
  };

  const handleSubmit = () => {
    const hasEmptyQuestionText = editableQuestions.some(
      (q) => q.questionText.trim() === ""
    );

    if (hasEmptyQuestionText) {
      alert("Please fill out the questionnaire before saving.");
      return;
    }

    const hasInvalidOptions = editableQuestions.some((q) => {
      const isChoiceType =
        q.type === "single-choice" || q.type === "multiple-choice";
      return (
        isChoiceType &&
        (q.options.length === 0 || q.options.every((opt) => opt.trim() === ""))
      );
    });

    if (hasInvalidOptions) {
      alert(
        "Please add at least one option for multiple choice question."
      );
      return;
    }

    setQuestions(editableQuestions);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-hidden">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          Add Application Questions
        </h2>

        {editableQuestions.map((q, index) => (
          <div key={index} className="p-4 border rounded shadow-sm mb-4 bg-gray-100">
            <div className="space-y-2">
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                placeholder="Enter question"
              />

              <select
                className="w-full border px-3 py-2 rounded"
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(index, "type", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="single-choice">Single Choice</option>
                <option value="multiple-choice">Multiple Choice</option>
              </select>

              {(q.type === "single-choice" || q.type === "multiple-choice") && (
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="w-full border px-2 py-1 rounded"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, oIndex, e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index, oIndex)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex w-full">
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="bg-blue-600 rounded-lg p-1 text-white text-xs ml-auto"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              )}
              <div className="flex w-full">
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="bg-red-600 rounded-md p-1 text-white text-xs ml-auto"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-2 bg-indigo-600 my-4 text-white rounded"
        >
          Add Question
        </button>

        <div className="flex justify-end my-2">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="ml-4 px-6 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditQuestionsModal;
