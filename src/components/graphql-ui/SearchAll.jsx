import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_ALL } from "@/graphql/queries/queriesFilter";

const SearchAll = ({
  searchTerm,
  onSearchChange,
  onSkillSelect,
  onRemoveSkill,
  setFieldValue,
  selectedSkillsFromParent,
  placeholder = "Search for skills, job titles...",
  noResultsMessage = "No results found",
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(
    selectedSkillsFromParent || []
  );
  const [skillSelected, setSkillSelected] = useState(false);

  const searchBarRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!skillSelected) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, skillSelected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data, loading, error } = useQuery(SEARCH_ALL, {
    variables: { query: debouncedSearchTerm || "" },
    skip: !debouncedSearchTerm || skillSelected,
  });

  const handleChange = (e) => {
    onSearchChange(e.target.value);
    setShowDropdown(true);
    setSkillSelected(false);
  };

  const handleSkillSelect = (item) => {
    const exists = selectedSkills.some(
      (s) => s.name === item.name && s.type === item.type
    );
    if (!exists) {
      const updated = [...selectedSkills, item];
      setSelectedSkills(updated);
      setFieldValue("skills", updated);
    }

    setSkillSelected(true);
    setShowDropdown(false);
    onSkillSelect(item);
    onSearchChange("");
  };

  const handleRemoveSkill = (itemToRemove) => {
    const updated = selectedSkills.filter(
      (s) => s.name !== itemToRemove.name || s.type !== itemToRemove.type
    );
    setSelectedSkills(updated);
    setFieldValue("skills", updated);
    onRemoveSkill(itemToRemove);
  };

  return (
    <div className="relative w-full" ref={searchBarRef}>
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      {loading && <p className="text-gray-500 text-sm mt-2">Loading...</p>}
      {error && (
        <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>
      )}
      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-auto">
          {data?.searchAll?.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              {noResultsMessage}
            </div>
          )}
          {data?.searchAll?.map((item) => (
            <div
              key={item._id}
              className="p-3 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer transition-colors duration-200 ease-in-out"
              onClick={() => handleSkillSelect(item)}
            >
              {item.name}{" "}
              {/* <span className="text-xs text-gray-400">({item.type})</span> */}
            </div>
          ))}
        </div>
      )}

      {selectedSkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedSkills.map((item, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center"
            >
              <span>{item.name}</span>
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleRemoveSkill(item)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAll;
