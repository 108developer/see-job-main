'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from './separator'

const FilterSidebar = ({ children }) => {
    const [experience, setExperience] = React.useState([0])

    return (
        <div className="w-full flex gap-5 border-r h-full">
            <div className="w-96 bg-background border-r p-4 h-screen overflow-y-auto">
                <h2 className="text-lg font-semibold ">Filters</h2>

                <div className="space-y-4">
                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="designer">Designer</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select>
                            <SelectTrigger id="location">
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newyork">New York</SelectItem>
                                <SelectItem value="london">London</SelectItem>
                                <SelectItem value="tokyo">Tokyo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="salary">Salary</Label>
                        <Input id="salary" type="number" placeholder="Enter minimum salary" />
                    </div>
                    <Separator />

                    <div className="space-y-2">
                        <Label>Experience (years)</Label>
                        <Slider
                            min={0}
                            max={15}
                            step={1}
                            value={experience}
                            onValueChange={setExperience}
                        />
                        <div className="text-sm text-muted-foreground">{experience} years</div>
                    </div>
                    <Separator />

                    <div className="space-y-2">
                        <Label>Education</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="bachelors" />
                                <label htmlFor="bachelors" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Bachelor's
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="masters" />
                                <label htmlFor="masters" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Master's
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="phd" />
                                <label htmlFor="phd" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    PhD
                                </label>
                            </div>
                        </div>
                    </div>
                    <Separator />

                    <Button className="w-full">Apply Filters</Button>
                </div>

            </div>
            <div className='w-full flex gap-4 pr-4 py-4'>
                {children}
            </div>
        </div>
    )
}

export default FilterSidebar