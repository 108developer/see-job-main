"use client";

import React, { useState } from "react";

const Keywords = ({ value, onChange }) => {
  const [keyword, setKeyword] = useState(""); // Input for new keyword

  // Add keyword if valid and not already included
  const addKeyword = () => {
    const trimmed = keyword.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setKeyword("");
    }
  };

  // Remove keyword by index
  const removeKeyword = (indexToRemove) => {
    const updated = value.filter((_, i) => i !== indexToRemove);
    onChange(updated);
  };

  // Add on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Input + Add Button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a keyword..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addKeyword}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Keyword Tags */}
      <div className="flex flex-wrap gap-2">
        {value.map((kw, index) => (
          <div
            key={`${kw}-${index}`}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
          >
            <span>{kw}</span>
            <button
              onClick={() => removeKeyword(index)}
              className="text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keywords;
