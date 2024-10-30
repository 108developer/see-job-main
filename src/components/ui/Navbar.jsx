"use client";
import { ArrowRight, Bell, Mail, PhoneIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import ResumeUploadModal from './Resume-modal';

const ResumeService = [
    { itemTitle: "Career Booster Resume", href: "/" },
    { itemTitle: "National Resume", href: "/" },
    { itemTitle: "International Resume", href: "/" },
];
const components = [
    { itemTitle: "About Us", href: "/" },
    { itemTitle: "Contact Us", href: "/" },
    { itemTitle: "Company Review", href: "/" },
];
const wfhData = [
    { itemTitle: "Work From Bangalore", href: "/" },
    { itemTitle: "Work From Delhi", href: "/" },
    { itemTitle: "Work From Kolkata", href: "/" },
    { itemTitle: "Work From Chennai", href: "/" },
    { itemTitle: "Work From Noida", href: "/" },
    { itemTitle: "Work From Gurugram", href: "/" },
    { itemTitle: "View All Locations", href: "/" },
];

const Navbar = () => {
    return (
        <div className=" w-full mx-auto">
            <TopBar />
            <div className="flex justify-center items-center  w-full text-smgap-6 bg-[#E3F2FD]">
                <div className="flex  justify-between items-center  max-w-6xl w-full text-sm p-5 gap-6 bg-[#E3F2FD]">
                    <div className="flex  items-center gap-6 bg-[#E3F2FD]">
                        <Image src="https://seejob.netlify.app/images/logo-2.png" alt="logo" width={100} height={100} className="w-fit h-auto" />
                        <div className="flex gap-6 items-center">
                            <DropdownMenu label="Work From Home" items={wfhData} />
                            <DropdownMenu label="Resume Service" items={ResumeService} />
                            <Link href="/career" className="text-gray-700  text-lg transition duration-300 ease-in-out hover:text-gray-400 ">
                                Career Tips
                            </Link>
                            <DropdownMenu label="Company Profile" items={components} />
                        </div>
                    </div>
                    <div className='w-fit truncate flex items-center gap-5'>
                            {/* className="text-gray-700  text-lg font-thin transition duration-300 ease-in-out hover:text-gray-400" */}
                            <ResumeUploadModal btntext="Post Your Resume" />
                        <button
                            className="text-white bg-red-600  text-lg font-thin px-3 py-1 rounded-md"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TopBar = () => (
    <div className="flex items-center justify-center w-full text-sm gap-2">
        <div className="flex items-center justify-between h-6 max-w-6xl w-full text-sm gap-2">
            <div className="flex h-6 w-fit text-sm p-4 gap-2">
                <ContactInfo icon={<PhoneIcon className="h-4" />} label="011-234-567" />
                <ContactInfo icon={<WhatsAppIcon />} label="WhatsApp Live Chat (10am to 6pm IST)" className="text-green-500" />
                <ContactInfo icon={<Mail className="h-5" />} label="011-234-567" className="text-red-600" />
            </div>
            <div className="flex h-6 w-fit text-sm p-4 gap-2">
                <ContactInfo icon={<Bell className="h-4" />} label="For Employers" className="text-[#17a2be]" />
            </div>
        </div>
    </div>
);

const ContactInfo = ({ icon, label, className }) => (
    <div className={`flex items-center font-bold gap-2 ${className}`}>
        {icon}
        <span>{label}</span>
    </div>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-5 h-5">
        <g fill="#2dd834" fillRule="nonzero">
            <g transform="scale(5.33333,5.33333)">
                <path d="M24,3.99805c-11.02771,0 -20,8.97229 -20,20c0,3.27532 0.86271,6.33681 2.26172,9.06641l-2.16797,7.76172c-0.50495,1.8034 1.27818,3.58644 3.08203,3.08203l7.76758,-2.16797c2.72738,1.39608 5.78439,2.25781 9.05664,2.25781c11.02771,0 20,-8.97229 20,-20c0,-11.02771 -8.97229,-20 -20,-20z" />
            </g>
        </g>
    </svg>
);

const DropdownMenu = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setIsOpen(false)}
                className="text-gray-500  text-lg font-thin transition duration-300 ease-in-out hover:text-gray-400"
            >
                {label}
            </button>
            {isOpen && (
                <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md w-48 z-10 ">
                    {items.map((item, index) => (
                        <li key={index} className="">
                            <Link href={item.href} className="flex items-center border-b border-dashed gap-2 transition duration-300 ease-in-out hover:bg-gray-100 p-3 ">
                                <ArrowRight className="h-4 text-red-800" />
                                {item.itemTitle}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Navbar;
