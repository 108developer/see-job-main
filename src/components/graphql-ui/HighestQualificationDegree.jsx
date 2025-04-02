import { SEARCH_DEGREES } from "@/graphql/queries/queriesFilter";
import { useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";

const DegreeSearchBar = ({
  searchTerm,
  onSearchChange,
  onDegreeSelect,
  setFieldValue,
  placeholder = "Search for highest education",
  noResultsMessage = "No results found",
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showDropdown, setShowDropdown] = useState(false);
  const [degreeSelected, setDegreeSelected] = useState(false);

  const searchBarRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!degreeSelected) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, degreeSelected]);

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

  const { data, loading, error } = useQuery(SEARCH_DEGREES, {
    variables: { query: debouncedSearchTerm },
    skip: !debouncedSearchTerm || degreeSelected,
  });

  const handleChange = (e) => {
    onSearchChange(e.target.value);
    setShowDropdown(true);
    setDegreeSelected(false);
  };

  const handleDegreeSelect = (degree) => {
    onDegreeSelect(degree);
    setFieldValue("highestQualification", degree.name);
    setDegreeSelected(true);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={searchBarRef}>
      <input
        type="text"
        className="w-full p-3 border-[1px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
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
          {data?.searchDegrees?.length === 0 && !loading && (
            <div className="p-3 text-center text-gray-500">
              {noResultsMessage}
            </div>
          )}
          {data?.searchDegrees?.map((degree) => (
            <div
              key={degree._id}
              className="p-3 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer transition-colors duration-200 ease-in-out"
              onClick={() => handleDegreeSelect(degree)}
            >
              {degree.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DegreeSearchBar;
