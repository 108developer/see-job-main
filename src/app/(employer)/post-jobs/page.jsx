import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import PostJob from "./PostJobs";

export async function generateMetadata() {
  const seo = await getSeoMetadata("post-jobs");
  return formatSeoMetadata(seo, "Post Job", "Your go-to career platform");
}

export default function Page() {
  return (
    <div>
      <PostJob />
    </div>
  );
}
