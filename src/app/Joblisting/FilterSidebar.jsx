import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
import JobTitleSearchBar from "@/components/graphql-ui/JobTitleSearchBar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "../../components/ui/separator";
import { jobType, salaryOptions } from "./constant";
import { Menu, X } from "lucide-react";

const FilterSidebar = ({ onFilterChange, children }) => {
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const [experience, setExperience] = useState([0]);

  const [selectedSalary, setSelectedSalary] = useState(null);

  const [savedJobTitle, setSavedJobTitle] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  useEffect(() => {
    const jobTitleFromStorage = localStorage.getItem("jobTitle");
    const locationFromStorage = localStorage.getItem("location");

    if (jobTitleFromStorage && jobTitleFromStorage !== selectedJobTitle) {
      setSavedJobTitle(jobTitleFromStorage);
      setSelectedJobTitle(jobTitleFromStorage);
      onFilterChange({ jobTitle: jobTitleFromStorage });
      localStorage.removeItem("jobTitle");
    }
    if (locationFromStorage && locationFromStorage !== location) {
      setSavedLocation(locationFromStorage);
      setLocation(locationFromStorage);
      onFilterChange({ location: locationFromStorage });
      localStorage.removeItem("location");
    }
  }, [onFilterChange, selectedJobTitle, location]);

  const handleSalaryChange = (value) => {
    const salaryMin = salaryOptions[value]?.label.replace(",", "") || null;

    if (!isNaN(salaryMin)) {
      setSelectedSalary(value);
      onFilterChange({
        salaryMin: salaryMin,
      });
    }
  };

  const debounceTimeout = useRef(null);

  const handleExperienceChange = (value) => {
    setExperience(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onFilterChange({
        experienceMin: value[0],
        experienceMax: value[1],
      });
    }, 1000);
  };

  useEffect(() => {
    onFilterChange({
      jobTypes: selectedJobTypes,
    });
  }, [selectedJobTypes]);

  const handleJobTypeChange = useCallback((type) => {
    setSelectedJobTypes((prevSelectedJobTypes) =>
      prevSelectedJobTypes.includes(type)
        ? prevSelectedJobTypes.filter((item) => item !== type)
        : [...prevSelectedJobTypes, type]
    );
  }, []);

  return (
    <div className="w-full flex gap-2 border-r h-full">
      <div
        className={`
      fixed z-40 inset-y-0 left-0 transform bg-background w-80 p-4 overflow-y-auto
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:transform-none border-r-2
    `}
      >
        {/* Sidebar content here */}

        {savedJobTitle && (
          <div className="px-2 py-1 bg-muted text-muted-foreground rounded-md mb-4 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-gray-700">
                Searched Job Title:{" "}
              </span>
              <span className="font-semibold text-red-700">
                "{savedJobTitle}"
              </span>
            </div>
          </div>
        )}

        {savedLocation && (
          <div className="px-2 py-1 bg-muted text-muted-foreground rounded-md mb-4 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-gray-700">
                Searched Location:{" "}
              </span>
              <span className="font-semibold text-red-700">
                "{savedLocation}"
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Filters</h2>
          {/* Close button only on mobile */}
          <button
            className="lg:hidden p-1 rounded hover:bg-gray-200"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Separator />

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="role">Title</Label>
            <JobTitleSearchBar
              searchTerm={jobTitleSearchTerm}
              onSearchChange={(value) => setJobTitleSearchTerm(value)}
              setFieldValue={() => {}}
              onJobTitleSelect={(selectedJobTitle) => {
                setJobTitleSearchTerm(selectedJobTitle.label);
                onFilterChange({ jobTitle: selectedJobTitle.label });
              }}
            />
          </div>

          <Separator />

          {/* Job Role */}
          {/* <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="relative">
              <Select onValueChange={handleJobRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {jobRoles.length > 0 ? (
                    jobRoles.map((jobRole) => (
                      <SelectItem key={jobRole.value} value={jobRole.value}>
                        {jobRole.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_roles" disabled>
                      No roles available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator /> */}

          {/* Job Type */}
          <div className="space-y-2">
            <Label>Job Type</Label>
            <div className="space-y-2">
              {jobType.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.toLowerCase().replace(" ", "_")}
                    checked={selectedJobTypes.includes(type)}
                    onCheckedChange={() => handleJobTypeChange(type)}
                  />

                  <Label htmlFor={type.toLowerCase().replace(" ", "_")}>
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <CityStateCountrySearchBar
              searchTerm={location}
              onSearchChange={(value) => setLocation(value)}
              setFieldValue={() => {}}
              onLocationSelect={(selectedLocation) => {
                setLocation(selectedLocation.fullAddress);
                onFilterChange({ location: selectedLocation.fullAddress });
              }}
            />
          </div>

          <Separator />

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Min Salary</Label>
            <Select onValueChange={handleSalaryChange}>
              <SelectTrigger id="salary">
                <SelectValue placeholder="Select salary" />
              </SelectTrigger>
              <SelectContent>
                {salaryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />

          {/* Experience */}
          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Slider
              min={0}
              max={15}
              step={1}
              value={experience}
              onValueChange={handleExperienceChange}
            />
            <div className="text-sm text-muted-foreground">
              {experience[0]} - {experience[1]} years
            </div>
          </div>
          <Separator />
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 p-4">
        <div className="lg:hidden h-8 flex gap-2 font-bold">
          <Menu
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />{" "}
          Filters
        </div>
        {children}
      </div>
    </div>
  );
};

export default FilterSidebar;
