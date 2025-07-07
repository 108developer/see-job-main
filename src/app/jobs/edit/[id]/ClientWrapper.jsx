"use client";

import { Loader } from "@/components/ui/loader";
import dynamic from "next/dynamic";

// Dynamically import PostedJobs component
const PostJobs = dynamic(() => import("./PostJobs"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full gap-8 p-4">
      <Loader count={5} height={50} className="mb-4" />
    </div>
  ),
});

const ClientWrapper = () => {
  return <PostJobs />;
};

export default ClientWrapper;
