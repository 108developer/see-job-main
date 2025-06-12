"use client";
import { Loader } from "@/components/ui/loader";
import { useEffect, useState } from "react";
import FindCV from "./FindCV";

export default function Wrapper() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  return <FindCV />;
}
