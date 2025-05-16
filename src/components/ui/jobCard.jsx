import ApplyJobModal from "@/app/joblisting/ApplyJobModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Banknote, CheckCircle, Clock, MapPin, StickyNote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function JobCard({ job, applyUrl } = { applyUrl: "#" }) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { userid, role } = useSelector((state) => state.auth);

  if (!job) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Job details not available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-md ">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <Link href={`/joblisting/${job._id}`}>
          <CardTitle className="text-3xl">{job.jobTitle}</CardTitle>
        </Link>

        {!(role === "employer" || role === "recruiter") &&
          (job?.hasApplied ? (
            <Button variant="destructive" size="sm" disabled>
              <span>Applied</span>
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsApplyModalOpen(true)}
            >
              <a className="text-white no-underline">Apply now</a>
            </Button>
          ))}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{job.companyName}</p>
        <div className="flex items-start space-x-2">
          <StickyNote className="h-4 w-4 mt-1 text-muted-foreground" />
          <p className="text-sm">{job.jobDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center">
            <Banknote className="mr-1 h-3 w-3" />
            {job.monthlySalary.min} - {job.monthlySalary.max} / month
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            {job.experience.min} - {job.experience.max} years experience
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {job.jobLocation}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted text-sm flex justify-center w-full items-center">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              <em>{formatDate(job.createdAt)}</em>
            </span>
          </div>
          <span className="text-green-600">
            (<em>⚑ {job.jobType.join(", ")}</em>)
          </span>
        </div>
      </CardFooter>
      {isApplyModalOpen && (
        <ApplyJobModal
          jobId={job._id}
          questions={job.questions}
          closeModal={() => setIsApplyModalOpen(false)}
        />
      )}
    </Card>
  );
}
