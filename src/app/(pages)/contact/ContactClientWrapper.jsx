"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/ui/loader";

// Dynamically import Contact component
const Contact = dynamic(() => import("./Contact"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full gap-8 p-4">
      <Loader count={5} height={50} className="mb-4" />
    </div>
  ),
});

const ContactClientWrapper = () => {
  return <Contact />;
};

export default ContactClientWrapper;
