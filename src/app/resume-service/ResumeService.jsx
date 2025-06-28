import Link from "next/link";

const ResumeService = () => {
  const services = [
    { href: "/linkedin-profile-makeover", label: "LinkedIn Profile Makeover" },
    { href: "/career-booster", label: "Career Booster Services" },
    { href: "/defence-force-personnels", label: "Defence Force Personnels" },
    { href: "/government-retired-person", label: "Government Retired Person" },
    { href: "/sop-lor-academic-resume", label: "SOP-LOR with Academic Resume" },
    { href: "/profile-highlighting", label: "Profile Highlighting" },
    { href: "/executive-class-resume", label: "Executive Class Resume" },
    { href: "/preferred-combo", label: "Preferred Combo" },
    { href: "/online-web-resume", label: "Online Web Resume" },
    { href: "/national-resume", label: "National Resume" },
    { href: "/international-resume", label: "International Resume" },
    { href: "/combo-resume", label: "Combo Resume" },
  ];

  const cards = [
    {
      title: "National",
      description:
        "Professionally written, ATS-optimized resumes tailored for Indian job markets. Emphasizes industry-specific keywords and local hiring trends.",
      features: [
        ["Industry", "Specific Writers"],
        ["Unlimited", "Modifications"],
        ["Custom-crafted", "Formats"],
        ["Personalised", "Attention"],
      ],
      orderLink: "/contact",
      readMore: "/national-resume",
    },
    {
      title: "International",
      description:
        "Globally accepted resume formats designed to meet international job standards. Ideal for those applying abroad or to multinational companies.",
      features: [
        ["Excruciatingly", "detailed Resume"],
        ["Globally Certified", "CV Writers"],
        ["24x7", "Global Sales Support"],
        ["International", "Cards Accepted"],
      ],
      orderLink: "/signup-form",
      readMore: "/international-resume",
    },
    {
      title: "Combo",
      description:
        "A dual-package solution offering both national and international resumes — perfect for professionals exploring opportunities both locally and globally.",
      features: [
        ["Economically", "Suitable"],
        ["Two Copy", "of Resumes"],
        ["Tailored", "to get target job"],
        ["Enhanced", "Features"],
      ],
      orderLink: "/signup-form",
      readMore: "/combo-resume",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">Choose Your Category</h2>
        <p className="text-center text-gray-700 max-w-xl mx-auto">
          Get our experts to write your resume using the right keywords.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Left Cards Section */}
        <div className="md:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(
            ({ title, description, features, orderLink, readMore }) => (
              <div
                key={title}
                className="border rounded-lg p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-sm text-gray-600 mb-5">{description}</p>
                  <ul className="space-y-2 mb-6">
                    {features.map(([strongText, normalText]) => (
                      <li
                        key={strongText}
                        className="text-gray-700 border-t border-green-500 py-2"
                      >
                        <strong className="text-yellow-500">
                          {strongText}
                        </strong>{" "}
                        {normalText}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Link
                    href={orderLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded mb-3"
                  >
                    ORDER NOW
                  </Link>
                </div>
              </div>
            )
          )}
        </div>

        {/* Right Sidebar Section */}
        <aside className="md:w-72 mt-10 md:mt-0">
          <div className="bg-yellow-500 text-white font-semibold px-5 py-3 rounded-t">
            OUR SERVICES
          </div>
          <nav className="border border-t-0 rounded-b shadow-sm">
            {services.map(({ href, label }) => (
              <Link
                key={label}
                // href={href}
                href={"#"}
                className="block px-5 py-3 border-t border-gray-200 text-blue-600 hover:bg-blue-50"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default ResumeService;
