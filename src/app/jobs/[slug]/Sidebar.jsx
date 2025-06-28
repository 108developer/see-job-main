import ResumeUploadModal from "@/components/ui/Resume-modal";

const Sidebar = () => {
  const jobTypes = [
    "Technical Job",
    "Government Job",
    "Electrician",
    "Bank Jobs",
    "IT jobs",
    "Media Jobs",
    "Teacher Jobs",
  ];

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Upload Resume Card */}
      <div className="bg-white shadow-md rounded-md p-4">
        <h6 className="text-center text-lg font-semibold mb-2">
          <i className="fas fa-upload mr-2"></i>Upload Your Resume
        </h6>
        <p className="text-center text-sm text-gray-600 mb-4">
          Registering gives you the benefit to browse & apply to a variety of
          jobs based on your preferences
        </p>

        <div className="rounded-md bg-yellow-500 w-full text-white py-2">
          <ResumeUploadModal btntext="Upload CV" />
        </div>
      </div>

      {/* Job by Top Skills */}
      <div className="bg-white shadow-md rounded-md p-4">
        <h4 className="text-lg font-semibold mb-3">Jobs by Top Skills</h4>
        <ul className="space-y-2">
          {jobTypes.map((skill, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="flex justify-between items-center text-gray-700 hover:text-blue-600"
              >
                {skill}
                <span className="text-red-600 font-bold">1055+</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* COVID Card */}
      <div className="bg-white shadow-md rounded-md p-4">
        <h6 className="text-center text-lg font-semibold text-red-600 uppercase mb-2">
          Is COVID-19 affecting your job?
        </h6>
        <p className="text-center text-sm text-gray-600 mb-4">
          If yes, then join{" "}
          <strong className="text-black">Work From Home</strong>
        </p>
        <a href="#" className="block w-full">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded">
            Join
          </button>
        </a>
      </div>

      {/* Talk to Us Card */}
      <div className="bg-white shadow-md rounded-md p-4 text-center">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">TALK TO US</h4>
        <p className="text-blue-600 text-sm">
          Free Tollfree no.
          <br />
          <span className="text-gray-500">Open: Mon-Thu 10am - 6pm</span>
        </p>
        <h2 className="text-2xl text-blue-600 font-bold mt-2">
          <i className="fas fa-phone-alt mr-2"></i>91-99588-41077
        </h2>
      </div>
    </div>
  );
};

export default Sidebar;
