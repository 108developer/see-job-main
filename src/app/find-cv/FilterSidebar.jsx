import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
import JobTitleSearchBar from "@/components/graphql-ui/JobTitleSearchBar";
import SkillDropdown from "@/components/graphql-ui/SkillsDropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  GET_CITY_STATE_COUNTRY,
  GET_DEGREES,
} from "@/graphql/queries/queriesFilter";
import { useQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import { salaryOptions } from "./constant";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [skillSet, setSkillSet] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const locationDropdownRef = useRef(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [degrees, setDegrees] = useState([]);

  const setFieldValue = (field, value) => {
    if (field === "skills") {
      onFilterChange({ skills: value });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const debouncedSearchTerm = useRef("");

  // const { data: jobRoleData } = useQuery(GET_JOB_ROLES);
  // const { data: jobTitleData } = useQuery(GET_JOB_TITLES);
  const { data: degreeData } = useQuery(GET_DEGREES);
  const { data, loading, error } = useQuery(GET_CITY_STATE_COUNTRY, {
    variables: { searchTerm: debouncedSearchTerm.current },
    skip: !debouncedSearchTerm.current || selectedLocation,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearchTerm.current = searchTerm;
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const debouncedChange = useRef(
    debounce((updatedFilters) => {
      onFilterChange(updatedFilters);
    }, 300)
  ).current;

  useEffect(() => {
    debouncedChange(filters);
  }, [filters]);

  const updateFilter = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleLocationSearch = (query) => {
    setSearchTerm(query);
    if (query.trim() === "") {
      setLocations([]);
    }
  };

  useEffect(() => {
    // if (jobRoleData?.getJobRole) setJobRoles(jobRoleData.getJobRole);
    // if (jobTitleData?.getJobTitle) setJobTitles(jobTitleData.getJobTitle);
    if (degreeData?.getDegree) setDegrees(degreeData.getDegree);
    // }, [jobRoleData, jobTitleData, degreeData]);
  }, [degreeData]);

  useEffect(() => {
    if (data?.cityStateCountry) {
      const formattedLocations = data.cityStateCountry.map(
        ({ city, state, country }) => ({
          label: `${city}, ${state}, ${country}`,
          value: `${city}, ${state}, ${country}`,
        })
      );
      setLocations(formattedLocations);
    }
  }, [data]);

  const handleLocationSelect = (value) => {
    onFilterChange({ location: value });
    setSelectedLocation(value);
    setSelectedLocation(value);
  };

  return (
    <div className="w-full flex gap-5 border-r h-full">
      <div className="w-96 bg-background border-r p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <div className="space-y-4">
          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <SkillDropdown
              searchTerm={skillSet}
              onSearchChange={(value) => setSkillSet(value)}
              setFieldValue={setFieldValue}
              selectedSkillsFromParent={filters.skills}
              onSkillSelect={(selectedSkill) => {
                const currentSkills = filters.skills || [];
                if (!currentSkills.includes(selectedSkill.name)) {
                  const updated = [...currentSkills, selectedSkill.name];
                  onFilterChange({ skills: updated });
                }
              }}
              onRemoveSkill={(skillToRemove) => {
                const updated = filters.skills.filter(
                  (skill) => skill !== skillToRemove
                );
                onFilterChange({ skills: updated });
              }}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <CityStateCountrySearchBar
              searchTerm={location}
              onSearchChange={(value) => setLocation(value)}
              setFieldValue={setFieldValue}
              onLocationSelect={(selectedLocation) => {
                setLocation(selectedLocation.fullAddress);
                setFieldValue("location", selectedLocation.fullAddress);
                onFilterChange({ location: selectedLocation.fullAddress });
              }}
            />
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label>Job Title</Label>
            <JobTitleSearchBar
              searchTerm={jobTitleSearchTerm}
              onSearchChange={(value) => setJobTitleSearchTerm(value)}
              setFieldValue={setFieldValue}
              onJobTitleSelect={(selectedJobTitle) => {
                setJobTitleSearchTerm(selectedJobTitle.label);
                setFieldValue("jobTitle", selectedJobTitle.label);
                onFilterChange({ jobTitle: selectedJobTitle.label });
              }}
            />
          </div>

          {/* Job Role */}
          {/* <div className="space-y-2">
            <Label>Job Role</Label>
            <Select onValueChange={(value) => updateFilter("jobRole", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Job Role" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.length > 0 ? (
                  jobRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_roles" disabled>
                    No roles available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div> */}

          {/* Job Type */}
          {/* <div className="space-y-2">
            <Label>Job Type</Label>
            {jobType.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.jobTypes?.includes(type) || false}
                  onCheckedChange={() => {
                    const updated = filters.jobTypes.includes(type)
                      ? filters.jobTypes.filter((t) => t !== type)
                      : [...filters.jobTypes, type];
                    onFilterChange({ jobTypes: updated });
                  }}
                />

                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </div> */}

          {/* Salary */}
          <div className="space-y-2">
            <Label>Salary</Label>
            <Select
              onValueChange={(value) => {
                const selectedSalary = salaryOptions[value]?.label;

                const salaryWithoutCommas = selectedSalary.replace(/,/g, "");
                const salaryValue = parseFloat(salaryWithoutCommas);

                onFilterChange({
                  salaryMin: salaryValue,
                  // salaryMax: salaryValue,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Salary Range" />
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

          {/* Experience */}
          <div className="space-y-2">
            <Label>Experience (Years)</Label>
            <div className="text-sm text-gray-600 w-full flex items-center justify-between">
              <div className="">{filters.experienceMin}</div>
              <div className="">{filters.experienceMax}</div>
            </div>
            <Slider
              min={0}
              max={15}
              step={1}
              value={[filters.experienceMin ?? 0, filters.experienceMax ?? 15]}
              minStepsBetweenThumbs={1}
              onValueChange={([min, max]) =>
                onFilterChange({ experienceMin: min, experienceMax: max })
              }
            />
          </div>

          {/* Degree */}
          <div className="space-y-2">
            <Label>Degree</Label>
            <Select onValueChange={(value) => updateFilter("degree", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Degree" />
              </SelectTrigger>
              <SelectContent>
                {degrees.length > 0 ? (
                  degrees.map((deg) => (
                    <SelectItem key={deg.value} value={deg.label}>
                      {deg.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_degrees" disabled>
                    No degrees available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              onValueChange={(value) => onFilterChange({ gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <Label>Age Range</Label>
            <div className="text-sm text-gray-600 w-full flex items-center justify-between">
              <div className="">{filters.ageMin}</div>
              <div className="">{filters.ageMax}</div>
            </div>
            <Slider
              min={18}
              max={60}
              step={1}
              value={[filters.ageMin ?? 18, filters.ageMax ?? 60]}
              minStepsBetweenThumbs={1}
              onValueChange={([min, max]) =>
                onFilterChange({ ageMin: min, ageMax: max })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FilterSidebar;
