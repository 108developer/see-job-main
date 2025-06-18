"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadResumeMutation } from "@/redux/api/candidateAuth";
import { AlertCircle, FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "react-toastify";

export default function ResumeUploadModal({ btntext }) {
  const router = useRouter();
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [uploadResume, { isLoading }] = useUploadResumeMutation();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setError(null);

    if (selectedFile) {
      const isValidType =
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (!isValidType) {
        setError("Please upload a PDF or Word document.");
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5MB.");
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file to upload.");
    if (!username || !email || !phone || !password)
      return setError("Please fill out all fields.");

    setError(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("resume", file);

    try {
      const res = await uploadResume(formData).unwrap();

      toast.success(res.message || "Uploaded successfully!");

      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setFile(null);
      setIsOpen(false);

      router.push("/");
    } catch (err) {
      const errorMessage =
        err?.data?.message || err.message || "Something went wrong.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full">{btntext}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Your Resume</DialogTitle>
          <DialogDescription>
            Fill in your information and upload your resume (PDF or Word, max
            5MB).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="resume">Resume</Label>
            <Input
              id="resume"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </div>

          {file && (
            <div className="text-sm text-muted-foreground">
              Selected file: {file.name}
            </div>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="m-0 p-0 font-medium">Error:</AlertTitle>
                <AlertDescription className="m-0 p-0">{error}</AlertDescription>
              </div>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
