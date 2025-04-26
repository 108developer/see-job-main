import { Phone, Upload } from "lucide-react";
import Image from "next/image";
import ResumeUploadModal from "@/components/ui/Resume-modal";

const AdBox = () => {
  return (
    <div className="w-[500px] flex flex-col gap-5 p-2">
      <div className="rounded-md flex-col gap-4 flex items-center justify-center border-gray-300 border  h-fit py-5 w-full text-center">
        <div className="text-3xl font-bold">Talk To Us</div>
        <div className="text-[#17a2b8] ">Free TollFree no.</div>
        <div className="text-xs text-gray-400">
          Open: Mon - Thur / 10 am - 6 pm
        </div>
        <div className="text-[#17a2b8] text-2xl items-center flex gap-2">
          <Phone fill="#17a2b8" />
          888-888-8888
        </div>
      </div>
      <div className="rounded-md flex items-center justify-center border-gray-300 border  h-fit w-full text-center">
        <div className="p-2 flex flex-col gap-3 text-start">
          <div className=" font-bold">Get Personalised Job Recommendations</div>
          <div className="text-xs">
            Registering gives you the benefit to browse & apply variety of jobs
            based on your preferences
          </div>
          <button className="rounded-md bg-blue-600 text-white py-2">
            Get Started
          </button>
        </div>
        <div className="items-center justify-center flex gap-2 p-4 bg-gray-300 h-full">
          <Image
            width={100}
            height={100}
            src="https://seejob.netlify.app/images/job-search.png"
            alt="personalized Image"
          />
        </div>
      </div>
      <div className="rounded-md flex flex-col items-center p-2 gap-5 justify-center border-gray-300 border  h-fit w-full text-center">
        <div className=" font-bold flex gap-2">
          {" "}
          <Upload /> Upload Your Resume
        </div>
        <div className="text-xs">
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
