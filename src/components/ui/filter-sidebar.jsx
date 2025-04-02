import { Button } from "@/components/ui/button";
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
import { GET_JOB_ROLES } from "@/graphql/queries/queriesFilter";
import { useQuery } from "@apollo/client";
import { City, Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { Separator } from "./separator";

const salaryOptions = [
  { value: 0, label: "0" },
  { value: 1, label: "10,000" },
  { value: 2, label: "20,000" },
  { value: 3, label: "30,000" },
  { value: 4, label: "40,000" },
  { value: 5, label: "50,000" },
  { value: 6, label: "60,000" },
  { value: 7, label: "70,000" },
  { value: 8, label: "80,000" },
  { value: 9, label: "90,000" },
  { value: 10, label: "100,000" },
  { value: 12, label: "120,000" },
  { value: 15, label: "150,000" },
];

const FilterSidebar = ({ onFilterChange, children }) => {
  const [jobRoles, setJobRoles] = useState([]);
  const { data, loading, error } = useQuery(GET_JOB_ROLES);

  const [experience, setExperience] = useState([0]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    if (data && data.getJobRole) {
      setJobRoles(data.getJobRole);
    }
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, [data]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setStates(State.getStatesOfCountry(value));
    setCities([]);
    onFilterChange({
      country: value,
      state: "",
      city: "",
    });
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setCities(City.getCitiesOfState(selectedCountry, value));
    onFilterChange({
      country: selectedCountry,
      state: value,
      city: "",
    });
  };

  const handleCityChange = (value) => {
    onFilterChange({
      country: selectedCountry,
      state: selectedState,
      city: value,
    });
  };

  const handleSalaryChange = (value) => {
    const salaryRange = salaryOptions[value]?.label.split("-");
    const salaryMin = salaryRange ? salaryRange[0].replace(",", "") : null;
    const salaryMax = salaryRange
      ? salaryRange[1]?.replace(",", "")
      : salaryMin;

    if (!isNaN(salaryMin) && !isNaN(salaryMax)) {
      setSelectedSalary(value);
      onFilterChange({
        salaryMin: salaryMin,
        salaryMax: salaryMax,
      });
    }
  };

  const handleExperienceChange = (value) => {
    setExperience(value);
    onFilterChange({
      experienceMin: value[0],
      experienceMax: value[1],
    });
  };

  const handleApplyFilters = () => {
    // Trigger the API call with the updated filters when "Apply Filters" is clicked
    onFilterChange({
      salaryMin: salaryOptions[selectedSalary]?.label.split("-")[0].replace(",", ""),
      salaryMax: salaryOptions[selectedSalary]?.label.split("-")[1]?.replace(",", "") || salaryOptions[selectedSalary]?.label.split("-")[0].replace(",", ""),
      experienceMin: experience[0],
      experienceMax: experience[1],
      country: selectedCountry,
      state: selectedState,
      city: cities[0]?.name,  // You can add more logic to handle multiple cities if needed
    });
  };

  return (
    <div className="w-full flex gap-5 border-r h-full">
      <div className="w-96 bg-background border-r p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold">Filters</h2>

        <div className="space-y-4">
          <Separator />

          {/* Job Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="relative">
              <Select>
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

          {/* Country */}
          <div>
            <Label htmlFor="country" className="block text-sm font-medium">
              Country
            </Label>
            <Select onValueChange={handleCountryChange}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.length > 0 ? (
                  countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_countries" disabled>
                    No countries available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* State */}
          {selectedCountry && (
            <div>
              <Label htmlFor="state" className="block text-sm font-medium">
                State
              </Label>
              <Select onValueChange={handleStateChange}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* City */}
          {selectedState && (
            <div>
              <Label htmlFor="city" className="block text-sm font-medium">
                City
              </Label>
              <Select onValueChange={handleCityChange}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id || city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
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

          {/* Education */}
          <div className="space-y-2">
            <Label>Education</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="bachelors" />
                <Label htmlFor="bachelors">Bachelor's</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="masters" />
                <Label htmlFor="masters">Master's</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="phd" />
                <Label htmlFor="phd">PhD</Label>
              </div>
            </div>
          </div>
          <Separator />

          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="w-full flex gap-4 pr-4 py-4">{children}</div>
    </div>
  );
};

export default FilterSidebar;
