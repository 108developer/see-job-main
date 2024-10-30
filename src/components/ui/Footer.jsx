import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";

export const Footer = () => {
  const categories = [
    {
      title: "Jobseeker",
      links: ["About Us", "Resume Services", "Term & Conditions", "Privacy Policy", "Career With us", "Contact Us", "Fraud Alert"],
    },
    {
      title: "Jobseeker",
      links: ["Register Now", "Search Jobs", "Login"],
    },
    {
      title: "Employer",
      links: ["Job Posting", "Recruiter Login", "Recruiter Register"],
    },
    {
      title: "Non-IT jobs",
      links: ["Human Resource", "Charted Accountant", "Teacher", "Pharmaceutical Jobs", "Management Job", "Chemical Jobs", "Medical Jobs"],
    },
    {
      title: "Reach To Us",
      links: ["9999-9999-99", "info@eseejob.com"],
    },
    {
      title: "Jobs By Role",
      links: [
        "Accountant Jobs",
        "Banking Jobs",
        "Branch Manager Jobs",
        "Teaching Jobs",
        "Executive Jobs",
        "Assistant Manager Jobs",
      ],
    },
    {
      title: "IT jobs",
      links: [
        "Android developer",
        "Java Developer",
        ".net Developer",
        "Html jobs",
        "SQL jobs",
        "Wordpress Developer"
      ],
    },
    {
      title: "Jobs By Location",
      links: [
        "Job in New Delhi",
        "Job in Chennai",
        "Job in Kolkata",
        "Job in Noida",
        "Job in Gurugram",
        "Job in Banglore",
        "Job in Pune",
        "Jobs IN Chandigarh",
      ],
    },
    // Duplicate categories removed for clarity
  ];

  return (
    <footer className="bg-[#2e3339] border-t">
      <div className="flex items-center p-5 justify-between bg-red-500 mx-auto px-4">
        <div className="text-white text-lg">Make You dream Successful Through Your Dream job.</div>
        <button className="text-black px-3 py-2 rounded-md bg-white">Search Job</button>
      </div>
      <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 sm:grid-cols-2">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col h-full">
              <p className="font-semibold  tracking-wide text-white">{category.title}</p>
              <ul className="mt-4 space-y-3">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="/"
                      className="text-white text-sm transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between pt-5 pb-10 border-t sm:flex-row">
          <p className="text-sm text-white">Copyright © 2010 - 2020 SeeJob Private Limited</p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <a
              href="/"
              className="flex items-center  text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <TwitterLogoIcon className="h-4" />
              Twitter
            </a>
            <a
              href="/"
              className="flex items-center  text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <InstagramLogoIcon className="h-4" />
              Instagram
            </a>
            <a
              href="/"
              className="flex items-center  text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <Facebook className="h-4" />
              FaceBook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
