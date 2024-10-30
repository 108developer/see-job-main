'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileUp, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ResumeUploadModal({ btntext }) {
    const [file, setFile] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0]
        setError(null)

        if (selectedFile) {
            if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                if (selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
                    setFile(selectedFile)
                } else {
                    setError('File size should not exceed 5MB.')
                }
            } else {
                setError('Please upload a PDF or Word document.')
            }
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.')
            return
        }

        setIsUploading(true)
        // Simulating file upload
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsUploading(false)
        setIsOpen(false)
        // Here you would typically send the file to your server
        console.log('File uploaded:', file.name)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className=''>{btntext}</button>
            </DialogTrigger>
            <DialogContent className=" sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Your Resume</DialogTitle>
                    <DialogDescription>
                        Upload your resume in PDF or Word format. Max file size is 5MB.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="resume">Resume</Label>
                        <Input id="resume" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                    </div>
                    {file && (
                        <div className="text-sm text-muted-foreground">
                            Selected file: {file.name}
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpload} disabled={!file || isUploading}>
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
    )
}