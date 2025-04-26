"use client";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const ExperienceDropdown = () => {
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleExperienceChange = (value) => {
    setExperience(value);
  };
  const handleLocationChange = (value) => {
    setLocation(value);
  };
  return (
    <div className="w-fit flex gap-5">
      <Input place type="text" className="bg-white" placeholder="Job Tile" />
      <div className="space-y-2">
        <Select
          onValueChange={handleExperienceChange}
          defaultValue={experience}
        >
          <SelectTrigger className="bg-white" id="experience">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Select onValueChange={handleLocationChange} defaultValue={location}>
          <SelectTrigger className="bg-white" id="location">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-york">New York</SelectItem>
            <SelectItem value="san-francisco">San Francisco</SelectItem>
            <SelectItem value="los-angeles">Los Angeles</SelectItem>
            <SelectItem value="chicago">Chicago</SelectItem>
            <SelectItem value="seattle">Seattle</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="bg-red-500 ">Search</Button>
    </div>
  );
};

export default ExperienceDropdown;
