import { Phone, Upload } from "lucide-react";
import Image from "next/image";
import ResumeUploadModal from "@/components/ui/Resume-modal";

const AdBox = () => {
  return (
    <div className="w-full max-w-md flex flex-col gap-6 p-4 mx-auto">
      {/* Talk To Us */}
      <div className="rounded-md flex flex-col gap-2 items-center justify-center border border-gray-300 py-6 px-4 text-center bg-white shadow-sm">
        <h2 className="text-2xl font-bold">Talk To Us</h2>
        <div className="text-[#17a2b8] font-semibold">Free Toll-Free No.</div>
        <div className="text-xs text-gray-500">
          Open: Mon - Thur / 10 am - 6 pm
        </div>
        <div className="text-[#17a2b8] text-xl flex items-center gap-2">
          <Phone fill="#17a2b8" />
          91-99588-41077
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="rounded-md flex flex-col justify-between border border-gray-300 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-100 flex items-center justify-center p-4 w-full">
          <Image
            width={80}
            height={80}
            className="object-contain"
            src="https://seejob.netlify.app/images/job-search.png"
            alt="personalized Image"
          />
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="font-bold text-base">
            Get Personalized Job Recommendations
          </div>
          <div className="text-sm text-gray-600">
            Registering gives you the benefit to browse & apply variety of jobs
            based on your preferences
          </div>
          <button className="rounded-md bg-blue-600 text-white py-2 px-4 w-fit hover:bg-blue-700 text-sm">
            Get Started
          </button>
        </div>
        
      </div>

      {/* Upload Resume */}
      <div className="rounded-md flex flex-col items-center p-4 gap-4 justify-center border border-gray-300 bg-white shadow-sm text-center">
        <div className="font-bold text-base flex items-center gap-2">
          <Upload /> Upload Your Resume
        </div>
        <div className="text-sm text-gray-600">
          Registering gives you the benefit to browse & apply variety of jobs
          based on your preferences
        </div>
        <div className="rounded-md bg-yellow-500 w-full text-white py-2">
          <ResumeUploadModal btntext="Upload CV" />
        </div>
      </div>
    </div>
  );
};

export default AdBox;
