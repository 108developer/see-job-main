"use client";

import { useSearchParams } from "next/navigation";
import CandidateProfile from "./CandidateProfile";

export default function CandidateProfileWrapper() {
  const searchParams = useSearchParams();
  const userid = searchParams.get("id");

  return <CandidateProfile userid={userid} />;
}
