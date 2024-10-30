import React from 'react'
import FilterSidebar from '@/components/ui/filter-sidebar'
import JobCard from '@/components/ui/jobCard'
import { Phone, Upload } from 'lucide-react'
import Image from 'next/image'
import ResumeUploadModal from '@/components/ui/Resume-modal'

const page = () => {
    const data = [
        {
            jobTitle: "Software Engineer",
            hiringForCompanies: "Tech Corp Solutions",
            jobDescription: "Responsible for developing and maintaining web applications.",
            monthlySalary: { min: 5000, max: 8000 },
            city: "New York",
            locality: "Manhattan",
            createdAt: "2024-10-01T08:30:00Z",
            jobType: "Full-Time",
            applyUrl: "https://company.jobs/apply/software-engineer"
        },
        {
            jobTitle: "Data Analyst",
            hiringForCompanies: "Data Insights Inc.",
            jobDescription: "Analyze and interpret complex data sets.",
            monthlySalary: { min: 4000, max: 6500 },
            city: "San Francisco",
            locality: "Downtown",
            createdAt: "2024-09-15T10:00:00Z",
            jobType: "Part-Time",
            applyUrl: "https://company.jobs/apply/data-analyst"
        },
        {
            jobTitle: "Product Manager",
            hiringForCompanies: "Innovate Solutions",
            jobDescription: "Lead product development and manage product lifecycle.",
            monthlySalary: { min: 7000, max: 12000 },
            city: "Chicago",
            locality: "Loop",
            createdAt: "2024-10-10T12:45:00Z",
            jobType: "Full-Time",
            applyUrl: "https://company.jobs/apply/product-manager"
        },
        {
            jobTitle: "UX/UI Designer",
            hiringForCompanies: "Creative Minds",
            jobDescription: "Design user interfaces and improve user experience.",
            monthlySalary: { min: 4500, max: 7500 },
            city: "Austin",
            locality: "Central Austin",
            createdAt: "2024-10-08T09:30:00Z",
            jobType: "Contract",
            applyUrl: "https://company.jobs/apply/ui-ux-designer"
        },
        {
            jobTitle: "Marketing Specialist",
            hiringForCompanies: "Brand Builders",
            jobDescription: "Develop and implement marketing strategies.",
            monthlySalary: { min: 4000, max: 6000 },
            city: "Los Angeles",
            locality: "Hollywood",
            createdAt: "2024-10-05T14:15:00Z",
            jobType: "Full-Time",
            applyUrl: "https://company.jobs/apply/marketing-specialist"
        },
        {
            jobTitle: "Backend Developer",
            hiringForCompanies: "WebWorks",
            jobDescription: "Develop server-side logic for web applications.",
            monthlySalary: { min: 5500, max: 9000 },
            city: "Seattle",
            locality: "Downtown",
            createdAt: "2024-10-07T11:20:00Z",
            jobType: "Remote",
            applyUrl: "https://company.jobs/apply/backend-developer"
        },
        {
            jobTitle: "Customer Support Representative",
            hiringForCompanies: "SupportPlus",
            jobDescription: "Provide customer support via phone and email.",
            monthlySalary: { min: 3000, max: 4000 },
            city: "Denver",
            locality: "Capitol Hill",
            createdAt: "2024-09-25T15:00:00Z",
            jobType: "Full-Time",
            applyUrl: "https://company.jobs/apply/customer-support-rep"
        },
        {
            jobTitle: "Cybersecurity Analyst",
            hiringForCompanies: "SecureTech",
            jobDescription: "Monitor and protect company systems from cyber threats.",
            monthlySalary: { min: 6000, max: 9500 },
            city: "Washington, D.C.",
            locality: "Capitol District",
            createdAt: "2024-10-12T08:45:00Z",
            jobType: "Full-Time",
            applyUrl: "https://company.jobs/apply/cybersecurity-analyst"
        },
        {
            jobTitle: "HR Manager",
            hiringForCompanies: "PeopleFirst",
            jobDescription: "Manage HR processes and employee relations.",
            monthlySalary: { min: 6500, max: 10000 },
            city: "Atlanta",
            locality: "Midtown",
            createdAt: "2024-10-02T13:30:00Z",
            jobType: "Full-Time",
            applyUrl: "https://company.jobs/apply/hr-manager"
        },
        {
            jobTitle: "Business Analyst",
            hiringForCompanies: "BizSolutions",
            jobDescription: "Analyze business requirements and suggest solutions.",
            monthlySalary: { min: 5500, max: 8500 },
            city: "Boston",
            locality: "Back Bay",
            createdAt: "2024-10-03T16:10:00Z",
            jobType: "Contract",
            applyUrl: "https://company.jobs/apply/business-analyst"
        }
    ]
    
    return (
        <div>
            <div className='w-full flex items-center py-5 border-b justify-center'>
                <div className='max-w-5xl w-full   '>
                    <div className='font-semibold'>Showing Result For " "</div>
                    <div className='flex gap-2 text-sm'>
                        <div className='border p-2 hover:bg-gray-400'>Java</div>
                        <div className='border p-2 hover:bg-gray-400'>PHP</div>
                        <div className='border p-2 hover:bg-gray-400'>Bootstrap</div>
                        <div className='border p-2 hover:bg-gray-400'>HTML</div>
                        <div className='border p-2 hover:bg-gray-400'>JavaScript</div>
                    </div>
                </div>
            </div>
            <FilterSidebar>
                <div className='w-full h-[600px] flex flex-col gap-5 overflow-y-auto'>{
                    data.map((job) => <JobCard job={job} />)
                }</div>
                <div className='w-[500px] flex flex-col gap-5'>
                    <div className='rounded-md flex-col gap-4 flex items-center justify-center border-gray-300 border  h-fit py-5 w-full text-center'>
                        <div className='text-3xl font-bold'>Talk To Us</div>
                        <div className='text-[#17a2b8] '>Free TollFree no.</div>
                        <div className='text-xs text-gray-400'>Open: Mon - Thur / 10 am - 6 pm</div>
                        <div className='text-[#17a2b8] text-2xl items-center flex gap-2'>
                            <Phone fill='#17a2b8' />
                            888-888-8888
                        </div>
                    </div>
                    <div className='rounded-md flex items-center justify-center border-gray-300 border  h-fit w-full text-center'>
                        <div className='p-2 flex flex-col gap-3 text-start'>
                            <div className=' font-bold'>Get Personalised Job Recommendations</div>
                            <div className='text-xs'>Registering gives you the benefit to browse & apply variety of jobs based on your preferences</div>
                            <button className='rounded-md bg-blue-600 text-white py-2'>Get Started</button>
                        </div>
                        <div className='items-center justify-center flex gap-2 p-4 bg-gray-300 h-full'>
                            <Image width={100} height={100} src='https://seejob.netlify.app/images/job-search.png' alt='personalized Image' />
                        </div>
                    </div>
                    <div className='rounded-md flex flex-col items-center p-2 gap-5 justify-center border-gray-300 border  h-fit w-full text-center'>
                        <div className=' font-bold flex gap-2'> <Upload /> Upload Your Resume</div>
                        <div className='text-xs'>Registering gives you the benefit to browse & apply variety of jobs based on your preferences</div>
                        <div className='rounded-md bg-yellow-500 w-full text-white py-2'><ResumeUploadModal btntext='Upload CV' /></div>
                    </div>
                </div>
            </FilterSidebar>
        </div>
    )
}

export default page