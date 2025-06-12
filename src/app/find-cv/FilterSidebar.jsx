import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
// import JobTitleSearchBar from "@/components/graphql-ui/JobTitleSearchBar";
// import SkillDropdown from "@/components/graphql-ui/SkillsDropdown";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GET_DEGREES } from "@/graphql/queries/queriesFilter";
import { useQuery } from "@apollo/client";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { salaryOptions } from "./constant";
import SearchAll from "@/components/graphql-ui/SearchAll";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [skillSet, setSkillSet] = useState("");
  const [degrees, setDegrees] = useState([]);
  const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setFieldValue = (field, value) => {
    if (field === "skills") {
      onFilterChange({ skills: value });
    }
  };

  const { data: degreeData } = useQuery(GET_DEGREES);

  const updateFilter = (key, value) => {
    onFilterChange({ [key]: value });
  };

  useEffect(() => {
    if (degreeData?.getDegree) setDegrees(degreeData.getDegree);
  }, [degreeData]);

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden p-4 flex items-center gap-2 font-semibold border-b">
        <Menu
          className="w-6 h-6 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
        <span>Filters</span>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-white w-64 p-4 overflow-y-auto transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:block lg:border-r
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            className="lg:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Search All */}
          <div className="space-y-2">
            <Label>Search</Label>
            <SearchAll
              searchTerm={skillSet}
              onSearchChange={(value) => setSkillSet(value)}
              setFieldValue={setFieldValue}
              selectedSkillsFromParent={filters.skills}
              onSkillSelect={(selectedItem) => {
                const current = filters.skills || [];

                const exists = current.some(
                  (item) =>
                    item.name === selectedItem.name &&
                    item.type === selectedItem.type
                );

                if (!exists) {
                  const updated = [...current, selectedItem];
                  onFilterChange({ skills: updated });
                }
              }}
              onRemoveSkill={(itemToRemove) => {
                const updated = filters.skills.filter(
                  (item) =>
                    item.name !== itemToRemove.name ||
                    item.type !== itemToRemove.type
                );
                onFilterChange({ skills: updated });
              }}
            />
          </div>

          {/* Skills */}
          {/* <div className="space-y-2">
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
          </div> */}

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
          {/* <div className="space-y-2">
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
          </div> */}

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
          {/* Salary */}
          <div className="space-y-2">
            <Label>Salary (₹)</Label>
            <div className="text-sm text-gray-600 w-full flex items-center justify-between">
              <div className="">₹{filters.salaryMin ?? 10000}</div>
              <div className="">₹{filters.salaryMax ?? 250000}</div>
            </div>
            <Slider
              min={10000}
              max={250000}
              step={5000}
              value={[filters.salaryMin ?? 10000, filters.salaryMax ?? 5000000]}
              minStepsBetweenThumbs={1}
              onValueChange={([min, max]) =>
                onFilterChange({ salaryMin: min, salaryMax: max })
              }
            />
          </div>

          {/* <div className="space-y-2">
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
                <SelectValue placeholder="Select Salary" />
              </SelectTrigger>
              <SelectContent>
                {salaryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

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
