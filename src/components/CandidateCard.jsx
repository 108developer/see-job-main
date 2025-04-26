import {
  Award,
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";

const CandidateCard = ({ candidate }) => {
  const {
    name,
    locality,
    age,
    gender,
    specialization,
    course,
    education,
    designation,
    experience,
    salary,
    location,
    board,
    shortlistedBy,
    lastActivity,
    keySkills,
  } = candidate;

  return (
    <div className="bg-pink-700 border shadow-md rounded-lg p-4 mt-4 w-full mx-auto">
      {/* Candidate Information Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h4 className="text-xl font-semibold text-red-600">
            <a href="candidate-application.html">{name || "Not Available"}</a>{" "}
            <small className="text-sm text-red-600">
              (<em>{locality || "Not Available"}</em>)
            </small>
          </h4>
          <h6 className="text-gray-500 text-sm">
            Age: {age || "Not Available"} / {gender || "Not Available"}
          </h6>
          <span>
            <UserCheck className="inline-block mr-1" /> Full Time,{" "}
            <strong>Specialization:</strong> {specialization || "Not Available"}
          </span>
        </div>
      </div>

      {/* Candidate Details */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div>
          <ul className="space-y-2">
            <li>
              <Award className="inline-block mr-1" /> Course:{" "}
              {course || "Not Available"}
            </li>
            <li>
              <Briefcase className="inline-block mr-1" /> Education:{" "}
              {education || "Not Available"}
            </li>
            <li>
              <UserCheck className="inline-block mr-1" /> Designation:{" "}
              {designation || "Not Available"}
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div>
          <ul className="space-y-2">
            <li>
              <Calendar className="inline-block mr-1" /> Exp:{" "}
              {experience || "Not Available"} years
            </li>
            <li>
              <MapPin className="inline-block mr-1" /> Salary:{" "}
              {salary || "Not Available"} PA
            </li>
            <li>
              <MapPin className="inline-block mr-1" /> Location:{" "}
              {location || "Not Available"}
            </li>
            <li>
              <Award className="inline-block mr-1" /> Board:{" "}
              {board || "Not Available"}
            </li>
          </ul>
        </div>
      </div>

      {/* Actions and Shortlisting Information */}
      <div className="mt-4 text-center">
        <p>
          <strong>
            Shortlisted by {shortlistedBy || "Not Available"} Recruiters
          </strong>
        </p>
        <span className="text-sm">
          <strong>Last Activity:</strong> {lastActivity || "Not Available"}
        </span>
        <div className="mt-2 flex justify-center gap-2">
          <button className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-md">
            <MessageCircle className="inline-block mr-1" /> SMS
          </button>
          <button className="bg-green-600 text-white text-sm py-2 px-4 rounded-md">
            <Mail className="inline-block mr-1" /> MAIL
          </button>
          <button className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-md">
            <Phone className="inline-block mr-1" /> CALL
          </button>
        </div>

        <button className="bg-yellow-500 text-white text-sm py-2 px-4 rounded-md mt-2">
          <a href="candidate-application.html">View Candidate</a>
        </button>

        {/* Shortlisting/Rejecting Buttons */}
        <div className="mt-2 flex justify-center gap-2">
          <button className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-md">
            <UserPlus className="inline-block mr-1" /> Shortlist
          </button>
          <button className="bg-red-600 text-white text-sm py-2 px-4 rounded-md">
            <UserX className="inline-block mr-1" /> Reject
          </button>
          <button className="bg-gray-100 text-gray-800 text-sm py-2 px-4 rounded-md">
            <UserCheck className="inline-block mr-1" /> Hold
          </button>
        </div>
      </div>

      {/* Remarks and Key Skills Section */}
      <div className="bg-gray-100 p-2 mt-4 rounded-md">
        <div className="flex justify-between items-center">
          <a href="#" className="text-red-600 font-semibold">
            <strong>Remarks</strong>
          </a>
          <a href="#" className="text-green-600 font-semibold">
            <i className="fab fa-whatsapp"></i> Whatsapp
          </a>
        </div>

        <p className="mt-2">
          <strong>Key Skills:</strong> {keySkills || "Not Available"}
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;
