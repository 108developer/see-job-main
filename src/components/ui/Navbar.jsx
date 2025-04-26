"use client";
import { setModal } from "@/redux/slices/modalSlice";
import { ArrowRight, Bell, Mail, PhoneIcon, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResumeUploadModal from "./Resume-modal";

const ResumeService = [
  {
    itemTitle: "Career Booster Resume",
    href: "https://solvehub.in/infoedge/services.html",
  },
  {
    itemTitle: "National Resume",
    href: "https://solvehub.in/infoedge/services.html",
  },
  {
    itemTitle: "International Resume",
    href: "https://solvehub.in/infoedge/services.html",
  },
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
  const [authLogin, setAuthLogin] = useState(false);
  const { token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
      <div className="flex justify-center items-center  w-full text-sm gap-6 bg-[#E3F2FD]">
        <div className="flex  justify-between items-center  max-w-6xl w-full text-sm p-5 gap-6 bg-[#E3F2FD]">
          <div className="flex  items-center gap-6 bg-[#E3F2FD]">
            <Link href={"/"}>
              <Image
                src="https://seejob.netlify.app/images/logo-2.png"
                alt="logo"
                width={100}
                height={100}
                className="w-fit h-auto"
              />
            </Link>
            <div className="flex gap-6 items-center">
              <DropdownMenu label="Work From Home" items={wfhData} />
              <DropdownMenu label="Resume Service" items={ResumeService} />
              <Link
                href="/career"
                className="text-gray-700  text-lg transition duration-300 ease-in-out hover:text-gray-400 "
              >
                Career Tips
              </Link>
              <DropdownMenu label="Company Profile" items={components} />
            </div>
          </div>
          <div className="w-fit flex items-center gap-5">
            <ResumeUploadModal btntext="Post Your Resume" />
            <UserDropdown
              authLogin={authLogin}
              role={role}
              openSignInModal={openSignInModal}
              openLogoutModal={openLogoutModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TopBar = () => (
  <div className="flex items-center justify-center w-full text-sm gap-2">
    <div className="flex items-center justify-between max-w-6xl w-full text-sm gap-2">
      <div className="flex w-fit text-sm p-4 gap-2">
        <ContactInfo
          icon={<PhoneIcon className="h-4" />}
          label="011-234-567"
          link="tel:+011234567"
        />

        <ContactInfo
          icon={<WhatsAppIcon />}
          label="WhatsApp Live Chat (10am to 6pm IST)"
          className="text-green-500"
          link="https://wa.me/011234567"
        />

        <ContactInfo
          icon={<Mail className="h-5" />}
          label="011-234-567"
          className="text-red-600"
          link="mailto:example@example.com"
        />
      </div>
      <div className="flex w-fit text-sm p-4 gap-2">
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
                className="flex items-center border-b border-dashed gap-2 px-3 py-2 transition duration-300 ease-in-out hover:bg-gray-100"
              >
                Buy Online
              </Link>
            </li>
            <li>
              <Link
                href="/employer-login"
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
      <span>{label}</span>
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
            <Link
              href={item.href}
              className="flex items-center border-b border-dashed gap-2 transition duration-300 ease-in-out hover:bg-gray-100 p-3 "
            >
              <li key={index}>
                <ArrowRight className="h-4 text-red-800" />
                {item.itemTitle}
              </li>
            </Link>
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

  {
    role === "employer"
      ? (items = [
          { itemTitle: "Profile", href: "/profile/employer" },
          { itemTitle: "Settings", href: "/employer/settings" },
        ])
      : (items = [
          { itemTitle: "Profile", href: "/profile/candidate" },
          { itemTitle: "Settings", href: "/candidate/settings" },
        ]);
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
            <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md w-24 z-10">
              {items.map((item) => (
                <li key={item.itemTitle}>
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
                  className="flex items-center gap-2 px-3 py-2 text-red-600 transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          )}
        </>
      ) : (
        <button
          onClick={openSignInModal}
          className="text-white bg-red-600 text-lg font-thin px-3 py-1 rounded-md"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Navbar;
