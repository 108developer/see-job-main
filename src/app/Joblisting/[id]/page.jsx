// Path: src/app/joblisting/[id]/page.jsx

import JobDetail from "./JobDetail";
import Sidebar from "./Sidebar";

export default function Page({ params }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 px-8 py-6">
      {/* Main Content */}
      <div className="w-full lg:w-3/4">
        <JobDetail />
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-1/4">
        <Sidebar />
      </aside>
    </div>
  );
}
