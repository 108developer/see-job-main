import {
  FAQ,
  HeroSection,
  JobCategory,
  ResumeService,
  Sliding,
} from "@/components/HomeComp";
import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import SEOModal from "./modals/SEOModal";

export async function generateMetadata() {
  const seo = await getSeoMetadata("Home");
  return formatSeoMetadata(seo, "See Job - Home", "Your go-to career platform");
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <SEOModal slug="Home" />
      <JobCategory />
      <Sliding />
      <ResumeService />
      <FAQ />
    </div>
  );
}
