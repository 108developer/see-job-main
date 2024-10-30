import { FAQ, HeroSection, JobCategory, ResumeService, Sliding } from "@/components/HomeComp";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <JobCategory />
      <Sliding />
      <ResumeService />
      <FAQ />
    </div>
  );
}
