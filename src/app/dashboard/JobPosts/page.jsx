import JobDataTableDemo from '@/components/job-table'
import DataTableDemo from '@/components/table-demo'
import React from 'react'

const page = () => {
  const data = [
    {
      _id: "001",
      title: "Senior Frontend Developer",
      company: "Innovative Solutions",
      location: "Bangalore, India",
      minExperience: 10,
      maxExperience: 15,
      skillsRequired: ["React", "JavaScript", "HTML", "CSS"],
      salary: "₹15,00,000 - ₹20,00,000",
      description: "We are looking for a Senior Frontend Developer with expertise in React.",
      postedDate: "2024-08-01",
      role: "frontend",
      languagesRequired: ["English"],
      employmentType: "Full-time"
    },
    {
      _id: "002",
      title: "Full-stack Developer",
      company: "TechCorp",
      location: "New York, USA",
      minExperience: 5,
      maxExperience: 8,
      skillsRequired: ["JavaScript", "Node.js", "React", "MongoDB"],
      salary: "$90,000 - $110,000",
      description: "Experienced full-stack developer needed for various web projects.",
      postedDate: "2024-08-03",
      role: "full-stack",
      languagesRequired: ["English"],
      employmentType: "Full-time"
    },
    {
      _id: "003",
      title: "Data Scientist",
      company: "DataHub",
      location: "London, UK",
      minExperience: 3,
      maxExperience: 5,
      skillsRequired: ["Python", "Machine Learning", "Data Analytics"],
      salary: "£70,000 - £90,000",
      description: "Join our analytics team as a Data Scientist working with large datasets.",
      postedDate: "2024-08-05",
      role: "data-scientist",
      languagesRequired: ["English", "French"],
      employmentType: "Full-time"
    },
    {
      _id: "004",
      title: "Marketing Specialist",
      company: "AdVentures",
      location: "Sydney, Australia",
      minExperience: 2,
      maxExperience: 5,
      skillsRequired: ["SEO", "Digital Marketing", "Content Strategy"],
      salary: "AU$75,000 - AU$90,000",
      description: "We are hiring a marketing specialist with experience in SEO and digital marketing.",
      postedDate: "2024-08-10",
      role: "marketing",
      languagesRequired: ["English"],
      employmentType: "Full-time"
    },
    {
      _id: "005",
      title: "Cloud Architect",
      company: "CloudMasters",
      location: "San Francisco, USA",
      minExperience: 10,
      maxExperience: 12,
      skillsRequired: ["Cloud Computing", "AWS", "DevOps"],
      salary: "$120,000 - $150,000",
      description: "Expert cloud architect needed for cloud infrastructure projects.",
      postedDate: "2024-08-15",
      role: "cloud-architect",
      languagesRequired: ["English"],
      employmentType: "Full-time"
    },
  ];

  return (
    <div className='p-5'><JobDataTableDemo data={data} /></div>
  )
}

export default page