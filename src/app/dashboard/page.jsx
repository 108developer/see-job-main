import JobseekerChart from "@/components/jobseeker-chart";

export default function Page() {
  return (
    (
      <>
        <div className=" p-5  h-fit w-full">
          <div>Home</div>
          <div className="flex py-2 h-fit w-full">
            <JobseekerChart />
          </div>
        </div>
      </>
    )
  );
}
