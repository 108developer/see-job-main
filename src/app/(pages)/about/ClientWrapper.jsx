"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/ui/loader";

// Dynamically import About component
const About = dynamic(() => import("./About"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full gap-8 p-4">
      <Loader count={5} height={50} className="mb-4" />
    </div>
  ),
});

const ClientWrapper = () => {
  return <About />;
};

export default ClientWrapper;
