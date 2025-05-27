"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSendNewsLetterMutation } from "@/redux/api/admin";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import { Input } from "../ui/input";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  // , "image"],
  // ["clean"],
];

export default function TextEditorModal({ selectedRecruiters }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendNewsLetter] = useSendNewsLetterMutation();
  const module = { toolbar: toolbarOptions };

  const uniqueEmails = Array.from(
    new Map(selectedRecruiters.map((r) => [r.email, r])).values()
  );

  const handleSendMail = async () => {
    if (!subject.trim()) {
      toast.error("Subject cannot be empty");
      return;
    }

    if (!message.trim()) {
      toast.warn("Message cannot be empty");
      return;
    }

    const plainText = message.replace(/<[^>]*>/g, "").trim();

    if (!plainText) {
      toast.warn("Message cannot be empty");
      return;
    }

    try {
      setIsSending(true);

      const receivers = uniqueEmails.map((r) => r.email);

      await sendNewsLetter({ receivers, subject, message }).unwrap();
      toast.success("Newsletter sent successfully");
      setOpen(false);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Server error while sending newsletter");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {selectedRecruiters.length > 0 && (
          <button className="px-2 py-1 mr-2 text-sm bg-blue-600 text-white rounded">
            Send Newsletter
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xs overflow-x-auto md:overflow-x-hidden md:max-w-xl lg:max-w-3xl gap-4 overflow-y-auto h-96">
        <DialogTitle>Send Newsletter</DialogTitle>

        <Input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
          className="w-full p-2 text-sm text-gray-800 rounded-md"
        />

        <ReactQuill
          value={message}
          onChange={setMessage}
          modules={module}
          theme="snow"
          placeholder="Write your newsletter message here..."
        />

        <div className="flex justify-end mt-16">
          <button
            onClick={handleSendMail}
            className={`px-4 py-2 rounded text-white ${
              isSending ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
