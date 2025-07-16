"use client";

import { useSearchParams } from "next/navigation";
import EmployerProfile from "./EmployerProfile";

export default function EmployerProfileWrapper() {
  const searchParams = useSearchParams();
  const userid = searchParams.get("id");

  return <EmployerProfile userid={userid} />;
}
