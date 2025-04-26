import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
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
import { GET_JOB_ROLES, GET_JOB_TITLES } from "@/graphql/queries/queriesFilter";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "../../components/ui/separator";
import { jobType, salaryOptions } from "./constant";

const FilterSidebar = ({ onFilterChange, children }) => {
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const [jobRoles, setJobRoles] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  const { data: jobRoleData } = useQuery(GET_JOB_ROLES);
  const { data: jobTitleData } = useQuery(GET_JOB_TITLES);

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

  useEffect(() => {
    if (jobRoleData && jobRoleData.getJobRole) {
      setJobRoles(jobRoleData.getJobRole);
    }
    if (jobTitleData && jobTitleData.getJobTitle) {
      setJobTitles(jobTitleData.getJobTitle);
    }
  }, [jobRoleData, jobTitleData]);

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
  }, [selectedJobTypes]); // only triggers after state update

  const handleJobTypeChange = useCallback((type) => {
    setSelectedJobTypes((prevSelectedJobTypes) =>
      prevSelectedJobTypes.includes(type)
        ? prevSelectedJobTypes.filter((item) => item !== type)
        : [...prevSelectedJobTypes, type]
    );
  }, []);

  const handleJobRoleChange = (value) => {
    setSelectedJobRole(value);
    onFilterChange({
      role: value,
    });
  };

  const handleJobTitleChange = (value) => {
    setSelectedJobTitle(value);
    onFilterChange({
      jobTitle: value,
    });
  };

  return (
    <div className="w-full flex gap-5 border-r h-full">
      <div className="w-96 bg-background border-r p-4 h-full overflow-y-auto">
        {savedJobTitle && (
          <div className="px-2 py-1 bg-muted text-muted-foreground rounded-md mb-4 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-gray-700">
                Searched Job Title:{" "}
              </span>
              <span className="font-semibold text-red-700">"{savedJobTitle}"</span>
            </div>
          </div>
        )}

        {savedLocation && (
          <div className="px-2 py-1 bg-muted text-muted-foreground rounded-md mb-4 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-gray-700">
                Searched Location:{" "}
              </span>
              <span className="font-semibold text-red-700">"{savedLocation}"</span>
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold">Filters</h2>

        <div className="space-y-4">
          <Separator />

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="role">Title</Label>
            <div className="relative">
              <Select onValueChange={handleJobTitleChange}>
                <SelectTrigger id="jobTitle">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {jobTitles.length > 0 ? (
                    jobTitles.map((jobTitle) => (
                      <SelectItem key={jobTitle.value} value={jobTitle.value}>
                        {jobTitle.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_titles" disabled>
                      No profiles available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Job Role */}
          <div className="space-y-2">
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

          <Separator />

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
            <LocationSearchBar
              searchTerm={location}
              onSearchChange={(value) => setLocation(value)}
              setFieldValue={() => {}}
              onLocationSelect={(selectedLocation) => {
                const address = selectedLocation.fullAddress;
                setLocation(address);
                onFilterChange({ location: address });
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

      <div className="w-full flex gap-4 pr-4 py-4">{children}</div>
    </div>
  );
};

export default FilterSidebar;
