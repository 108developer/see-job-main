import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Facebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Footer = () => {
  const router = useRouter();

  const categories = [
    {
      title: "About",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Resume Services", href: "/resume-service" },
        { label: "Term & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Career With us", href: "/career" },
        { label: "Contact Us", href: "/contact" },
        // { label: "Fraud Alert", href: "/fraud" },
      ],
    },
    {
      title: "For Jobseekers",
      links: [
        { label: "Register Now", href: "#" },
        { label: "Search Jobs", href: "#" },
        { label: "Login", href: "#" },
      ],
    },
    {
      title: "For Employers",
      links: [
        { label: "Job Posting", href: "#" },
        { label: "Recruiter Login", href: "#" },
        { label: "Recruiter Register", href: "#" },
      ],
    },
    {
      title: "Non-IT Jobs",
      links: [
        { label: "Human Resource", href: "#" },
        { label: "Charted Accountant", href: "#" },
        { label: "Teacher", href: "#" },
        { label: "Pharmaceutical Jobs", href: "#" },
        { label: "Management Job", href: "#" },
        { label: "Chemical Jobs", href: "#" },
        { label: "Medical Jobs", href: "#" },
      ],
    },
    {
      title: "Reach To Us",
      links: [
        { label: "+91-99588-41077", href: "tel:+91-99588-41077" },
        { label: "sale@seejob.in", href: "mailto:sale@seejob.in" },
      ],
    },
    {
      title: "Jobs By Role",
      links: [
        { label: "Accountant Jobs", href: "#" },
        { label: "Banking Jobs", href: "#" },
        { label: "Branch Manager Jobs", href: "#" },
        { label: "Teaching Jobs", href: "#" },
        { label: "Executive Jobs", href: "#" },
        { label: "Assistant Manager Jobs", href: "#" },
      ],
    },
    {
      title: "IT Jobs",
      links: [
        { label: "Android Developer", href: "#" },
        { label: "Java Developer", href: "#" },
        { label: ".NET Developer", href: "#" },
        { label: "HTML Jobs", href: "#" },
        { label: "SQL Jobs", href: "#" },
        { label: "WordPress Developer", href: "#" },
      ],
    },
    {
      title: "Jobs By Location",
      links: [
        { label: "Job in New Delhi", href: "#" },
        { label: "Job in Chennai", href: "#" },
        { label: "Job in Kolkata", href: "#" },
        { label: "Job in Noida", href: "#" },
        { label: "Job in Gurugram", href: "#" },
        { label: "Job in Bangalore", href: "#" },
        { label: "Job in Pune", href: "#" },
        { label: "Jobs in Chandigarh", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#2e3339] border-t text-white">
      <div className="flex items-center p-5 justify-between bg-red-500 mx-auto px-4">
        <div className="text-lg">
          Make your dream successful through your dream job.
        </div>

        <Link href="/Joblisting">
          <button className="text-black px-3 py-2 rounded-md bg-white">
            Search Job
          </button>
        </Link>
      </div>

      <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 sm:grid-cols-2">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col h-full">
              <p className="font-semibold tracking-wide">{category.title}</p>
              <ul className="mt-4 space-y-3">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href === "#" ? (
                      <button
                        onClick={() => {
                          if (category.title === "Jobs By Location") {
                            const city = link.label
                              .replace("Job in ", "")
                              .replace("Jobs in ", "");
                            localStorage.setItem("location", city);
                            localStorage.removeItem("jobTitle");
                          } else if (
                            category.title === "Jobs By Role" ||
                            category.title === "IT Jobs" ||
                            category.title === "Non-IT Jobs"
                          ) {
                            const jobTitle = link.label
                              .replace(" Jobs", "")
                              .replace("Job ", "")
                              .trim();
                            localStorage.setItem("jobTitle", jobTitle);
                            localStorage.removeItem("location");
                          }
                          router.push("/Joblisting");
                        }}
                        className="text-left text-sm text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-300 hover:text-deep-purple-accent-400"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-gray-700 sm:flex-row mt-10">
          <p className="text-sm">© 2010 - 2025 SeeJob Private Limited</p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <a
              href="#"
              className="flex items-center transition-colors duration-300 hover:text-purple-400"
            >
              <TwitterLogoIcon className="h-4 w-4 mr-1" />
              Twitter
            </a>
            <a
              href="#"
              className="flex items-center transition-colors duration-300 hover:text-purple-400"
            >
              <InstagramLogoIcon className="h-4 w-4 mr-1" />
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center transition-colors duration-300 hover:text-purple-400"
            >
              <Facebook className="h-4 w-4 mr-1" />
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
