import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import PostedJobs from "./PostedJobs";

export async function generateMetadata() {
  const seo = await getSeoMetadata("posted-jobs");
  return formatSeoMetadata(seo, "Posted Job", "Your go-to career platform");
}

export default function Page() {
  return (
    <div>
      <PostedJobs />
    </div>
  );
}
