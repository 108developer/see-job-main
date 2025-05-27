import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

export function PlanUpdateModal({ recruiter, onSubmit }) {
  const [open, setOpen] = useState(false);

  const subscription = recruiter.subscription || {};

  const formik = useFormik({
    initialValues: {
      plan: subscription.plan || "Free",
      status: subscription.status || "Active",
      startDate: subscription.startDate
        ? new Date(subscription.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: subscription.endDate
        ? new Date(subscription.endDate).toISOString().split("T")[0]
        : new Date(new Date().setDate(new Date().getDate() + 30))
            .toISOString()
            .split("T")[0],
      allowedResume: subscription.allowedResume || 0,
    },
    onSubmit: async (values) => {
      try {
        await onSubmit(recruiter.id, values);
        setOpen(false);
      } catch (err) {
        toast.error("Update failed");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {subscription.plan || "Free"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="mb-1">Plan</label>
            <select
              name="plan"
              value={formik.values.plan}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1 outline-none"
            >
              <option value="Free">Free</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="mb-1">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="w-full border rounded px-2 py-1 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="mb-1">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <label className="mb-1">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <label className="mb-1">Allowed Resumes</label>
            <Input
              type="number"
              name="allowedResume"
              value={formik.values.allowedResume}
              onChange={formik.handleChange}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
