import JobApply from "@/app/Joblisting/JobApply";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DOMPurify from "dompurify";
import {
  Banknote,
  CheckCircle,
  Clock,
  Edit2,
  Edit3Icon,
  MapPin,
  StickyNote,
} from "lucide-react";
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

export default function PostedJobCard({ job, applyUrl } = { applyUrl: "#" }) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { userid } = useSelector((state) => state.auth);

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
      <CardHeader className="flex flex-col md:flex-row items-start justify-between space-y-0 gap-2">
        <Link href={`/jobs/${job.url}`}>
          <CardTitle className="text-3xl">{job.jobTitle}</CardTitle>
        </Link>
        <div className="flex gap-2">
          <Link href={`/jobs/edit/${job._id}`}>
            <Button variant="outline" size="sm" asChild>
              <span className="flex items-center gap-1">
                <Edit2 className="h-4 w-4" /> Edit
              </span>
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/job-applications",
              query: {
                jobId: job._id,
              },
            }}
          >
            <Button variant="destructive" size="sm" asChild>
              <span className="text-white no-underline">View Applications</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{job.companyName}</p>
        <div className="flex items-start space-x-2">
          <StickyNote className="h-4 w-4 mt-1 text-muted-foreground" />

          <div className="flex flex-col md:flex-row items-end md:justify-between w-full">
            <div
              className="job-description line-clamp-4 w-full"
              dangerouslySetInnerHTML={{ __html: job.jobDescription }}
            />
            <Link href={`/jobs/${job.url}`}>
              <span className="text-blue-600 underline cursor-pointer whitespace-nowrap flex items-end text-xs mt-auto">
                Read More
              </span>
            </Link>
          </div>
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
        <div className="flex flex-col md:flex-row gap-2 md:justify-between md:items-center w-full">
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
        <JobApply
          jobId={job._id}
          questions={job.questions}
          closeModal={() => setIsApplyModalOpen(false)}
        />
      )}
    </Card>
  );
}
