"use client";
import { setModal } from "@/redux/slices/modalSlice";
import {
  ArrowRight,
  Bell,
  File,
  Mail,
  Notebook,
  PhoneIcon,
  Upload,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResumeUploadModal from "./Resume-modal";

const ResumeService = [
  {
    itemTitle: "Career Booster Resume",
    href: "/resume-service",
    // href: "https://solvehub.in/infoedge/services.html",
  },
  {
    itemTitle: "National Resume",
    href: "/resume-service",
    // href: "https://solvehub.in/infoedge/services.html",
  },
  {
    itemTitle: "International Resume",
    href: "/resume-service",
    // href: "https://solvehub.in/infoedge/services.html",
  },
];
const components = [
  { itemTitle: "About Us", href: "/about" },
  { itemTitle: "Contact Us", href: "/contact" },
  { itemTitle: "Company Review", href: "/company_reviews" },
];
const wfhData = [
  { itemTitle: "Work From Bangalore", location: "Bangalore" },
  { itemTitle: "Work From Delhi", location: "Delhi" },
  { itemTitle: "Work From Kolkata", location: "Kolkata" },
  { itemTitle: "Work From Chennai", location: "Chennai" },
  { itemTitle: "Work From Noida", location: "Noida" },
  { itemTitle: "Work From Gurugram", location: "Gurugram" },
  { itemTitle: "View All Locations", location: "" },
];

const Navbar = () => {
  const [authLogin, setAuthLogin] = useState(false);
  const { token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [userRole, setUserRole] = useState(null);

  const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleFindJobs = () => {
    localStorage.setItem("jobTitle", jobTitleSearchTerm);
    localStorage.setItem("location", location);
  };

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    setUserRole(roleFromStorage);
  }, []);

  useEffect(() => {
    if (token) {
      setAuthLogin(true);
    } else {
      setAuthLogin(false);
    }
  }, [token]);

  const openLogoutModal = () => {
    dispatch(setModal({ modalType: "logout" }));
  };

  const openSignInModal = () => {
    dispatch(setModal({ modalType: "candidateAuth" }));
  };

  return (
    <div className=" w-full mx-auto">
      <TopBar />
      <div className="flex justify-between items-center w-full text-sm gap-6 bg-[#E3F2FD] p-2 md:p-5 lg:px-28">
        <div className="flex items-center gap-6 bg-[#E3F2FD]">
          <Link href={"/"}>
            <Image
              src="https://seejob.netlify.app/images/logo-2.png"
              alt="logo"
              width={100}
              height={100}
              className="w-fit h-auto hidden md:block"
            />
          </Link>
          <div className="flex flex-wrap gap-3 items-center">
            <DropdownMenu
              label="Work From Home"
              items={wfhData}
              onItemClick={(item) => {
                setLocation(item.location);
                localStorage.setItem("location", item.location);
                localStorage.setItem("jobTitle", jobTitleSearchTerm);
              }}
            />
            <DropdownMenu label="Resume Service" items={ResumeService} />
            <Link
              href="/career"
              className="text-gray-700 flex-nowrap md:text-lg transition duration-300 ease-in-out hover:text-gray-400 "
            >
              Career Tips
            </Link>
            <DropdownMenu label="Company Profile" items={components} />
          </div>
        </div>
        <div className="w-fit flex flex-col md:flex-row items-center gap-5">
          {userRole !== "employer" &&
            userRole !== "candidate" &&
            userRole !== "admin" && (
              <div className="hidden md:flex gap-2">
                <Upload />
                <ResumeUploadModal btntext="CV Upload" />
              </div>
            )}
          <UserDropdown
            authLogin={authLogin}
            role={role}
            openSignInModal={openSignInModal}
            openLogoutModal={openLogoutModal}
          />
        </div>
      </div>
    </div>
  );
};

const TopBar = () => (
  <div className="w-full text-sm">
    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2 gap-2">
      {/* Contact Info */}
      <div className="flex items-center flex-wrap gap-4 text-xs md:text-sm">
        <ContactInfo
          icon={<PhoneIcon className="h-4" />}
          label="91-99588-41077"
          link="tel:+91-99588-41077"
        />
        <ContactInfo
          icon={<WhatsAppIcon />}
          label="WhatsApp Live Chat (10am to 6pm IST)"
          className="text-green-500"
          link="https://api.whatsapp.com/send?phone=919958841077&text=Hello%20I%20am%20looking%20for%20enquiry%20regarding"
        />
        <ContactInfo
          icon={<Mail className="h-4 text-red-600" />}
          label="sale@seejob.in"
          className="text-red-600"
          link="mailto:sale@seejob.in"
        />
      </div>
      <div className="rounded mt-2 md:mt-0">
        <ForEmployers />
      </div>
    </div>
  </div>
);

const ForEmployers = () => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const boxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setIsBoxOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div
        onClick={() => setIsBoxOpen(!isBoxOpen)}
        className="flex items-center font-bold gap-2 text-[#17a2be] cursor-pointer"
      >
        <Bell className="h-4" />
        <span>For Employers</span>
      </div>
      {isBoxOpen && (
        <div
          ref={boxRef}
          className="absolute top-full right-0 bg-gray-100 shadow-lg rounded-md w-32 z-10 mt-2"
        >
          <ul>
            <li>
              <Link
                href="/buy-online"
                onClick={() => setIsBoxOpen(false)}
                className="flex items-center border-b border-dashed gap-2 px-3 py-2 transition duration-300 ease-in-out hover:bg-gray-100"
              >
                Buy Online
              </Link>
            </li>
            <li>
              <Link
                href="/employer-login"
                onClick={() => setIsBoxOpen(false)}
                className="flex items-center gap-2 px-3 py-2 transition duration-300 ease-in-out hover:bg-gray-100"
              >
                Employer Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const ContactInfo = ({ icon, label, className, link }) => (
  <a
    href={link}
    target={link.startsWith("http") ? "_blank" : "_self"}
    rel="noopener noreferrer"
  >
    <div className={`flex items-center font-bold gap-2 ${className}`}>
      {icon}
      <span className="hidden md:block">{label}</span>
    </div>
  </a>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className="w-5 h-5"
  >
    <g fill="#2dd834" fillRule="nonzero">
      <g transform="scale(5.33333,5.33333)">
        <path d="M24,3.99805c-11.02771,0 -20,8.97229 -20,20c0,3.27532 0.86271,6.33681 2.26172,9.06641l-2.16797,7.76172c-0.50495,1.8034 1.27818,3.58644 3.08203,3.08203l7.76758,-2.16797c2.72738,1.39608 5.78439,2.25781 9.05664,2.25781c11.02771,0 20,-8.97229 20,-20c0,-11.02771 -8.97229,-20 -20,-20z" />
      </g>
    </g>
  </svg>
);

const DropdownMenu = ({ label, items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        // onBlur={() => setIsOpen(false)}
        className="text-gray-500 flex-nowrap md:text-lg font-thin transition duration-300 ease-in-out hover:text-gray-400"
      >
        {label}
      </button>
      {isOpen && (
        <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md w-48 z-10 ">
          {items.map((item, index) => (
            <li key={index} className="hover:bg-gray-100">
              <Link
                href={item?.href || "/Joblisting"}
                // href="/Joblisting"
                onClick={() => {
                  setIsOpen(false);
                  if (onItemClick) onItemClick(item);
                }}
                className="w-full h-full flex items-center border-b border-dashed gap-2 transition duration-300 ease-in-out hover:bg-gray-100 p-3"
              >
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

const UserDropdown = ({
  authLogin,
  role,
  openSignInModal,
  openLogoutModal,
}) => {
  let items = [];

  if (role === "employer") {
    items = [
      { itemTitle: "Profile", href: "/profile/employer" },
      // { itemTitle: "Settings", href: "/employer/settings" },
      { itemTitle: "Post Jobs", href: "/post-jobs" },
      { itemTitle: "Posted Jobs", href: "/posted-jobs" },
    ];
  } else if (role === "candidate") {
    items = [
      { itemTitle: "All Jobs", href: "/Joblisting" },
      { itemTitle: "Profile", href: "/profile/candidate" },
    ];
  } else {
    // Default (e.g., admin or others)
    items = [
      { itemTitle: "Admin Panel", href: "/admin" },
      { itemTitle: "Admin Dashboard", href: "/admin/dashboard" },
    ];
  }

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {authLogin ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 text-lg font-thin transition duration-300 ease-in-out hover:text-gray-400"
          >
            <UserCircle className="h-8 w-8" />
          </button>
          {isOpen && (
            <ul className="absolute top-full right-0 bg-white shadow-lg rounded-md w-36 z-10">
              {items.map((item) => (
                <li key={item.itemTitle} onClick={() => setIsOpen(false)}>
                  <Link
                    href={item.href}
                    className="flex items-center border-b border-dashed gap-2 transition duration-300 ease-in-out hover:bg-gray-100 p-3"
                  >
                    {item.itemTitle}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={openLogoutModal}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 transition duration-300 ease-in-out hover:bg-gray-100 w-full whitespace-nowrap"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={openSignInModal}
            className="text-white bg-red-600 text-lg font-thin px-3 py-1 rounded-md whitespace-nowrap"
          >
            Login
          </button>

          <Link href={"/candidate-register"}>
            <button className="text-white bg-red-600 text-lg font-thin px-3 py-1 rounded-md whitespace-nowrap">
              Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
