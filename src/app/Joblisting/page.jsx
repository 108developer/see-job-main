import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import Joblisting from "./Joblisting";

export async function generateMetadata() {
  const seo = await getSeoMetadata("Joblisting");
  return formatSeoMetadata(
    seo,
    "See Job - Joblisting",
    "Your go-to career platform"
  );
}

export default function Page() {
  return (
    <div>
      <Joblisting />
    </div>
  );
}
