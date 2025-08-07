"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";

interface FileUploadProps {
   onUploadComplete: (files: { key: string; url: string }[]) => void;
   maxFiles?: number;
   accept?: string[];
   className?: string;
}

interface UploadedFile {
   key: string;
   url: string;
   name: string;
   size: number;
}

export function FileUploader({
   onUploadComplete,
   maxFiles = 5,
   accept = ["image/*"],
   className,
}: FileUploadProps) {
   const [files, setFiles] = useState<UploadedFile[]>([]);
   const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);

   const { startUpload } = useUploadThing("menuCategory", {
      onClientUploadComplete: (res) => {
         if (res) {
            const uploadedFiles = res.map((file) => ({
               key: file.key,
               url: file.ufsUrl,
               name: file.name,
               size: file.size,
            }));
            setFiles((prev) => [...prev, ...uploadedFiles]);
            onUploadComplete(uploadedFiles);
            setIsUploading(false);
            setUploadProgress(0);
         }
      },
      onUploadError: (error) => {
         console.error("Upload error:", error);
         setIsUploading(false);
         setUploadProgress(0);
      },
      onUploadProgress: (progress) => {
         setUploadProgress(progress);
      },
   });

   const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
         if (files.length + acceptedFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
         }

         setIsUploading(true);
         await startUpload(acceptedFiles);
      },
      [files.length, maxFiles, startUpload],
   );

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
      maxFiles: maxFiles - files.length,
      disabled: isUploading || files.length >= maxFiles,
   });

   const removeFile = (keyToRemove: string) => {
      const updatedFiles = files.filter((file) => file.key !== keyToRemove);
      setFiles(updatedFiles);
      onUploadComplete(updatedFiles);
   };

   const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
   };

   return (
      <div className={cn("w-full space-y-4", className)}>
         {/* Upload Area */}
         <div
            {...getRootProps()}
            className={cn(
               "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
               isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50",
               isUploading || files.length >= maxFiles
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-muted/25",
            )}
         >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
               <Upload className="text-muted-foreground h-8 w-8" />
               {isDragActive ? (
                  <p className="text-primary text-sm">Drop files here...</p>
               ) : (
                  <div className="space-y-1">
                     <p className="text-sm font-medium">
                        Drag & drop files here, or click to select
                     </p>
                     <p className="text-muted-foreground text-xs">
                        {accept.join(", ")} up to {maxFiles} files
                     </p>
                  </div>
               )}
            </div>
         </div>

         {/* Upload Progress */}
         {isUploading && (
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
               </div>
               <Progress value={uploadProgress} />
            </div>
         )}

         {/* Uploaded Files */}
         {files.length > 0 && (
            <div className="space-y-2">
               <h4 className="text-sm font-medium">
                  Uploaded Files ({files.length})
               </h4>
               <div className="grid gap-2">
                  {files.map((file) => (
                     <div
                        key={file.key}
                        className="bg-muted/25 flex items-center gap-3 rounded-lg border p-3"
                     >
                        {file.url ? (
                           <div className="relative h-10 w-10 overflow-hidden rounded">
                              <Image
                                 src={file.url}
                                 alt={file.name}
                                 fill
                                 sizes="auto"
                                 className="object-cover"
                              />
                           </div>
                        ) : (
                           <ImageIcon className="text-muted-foreground h-10 w-10" />
                        )}
                        <div className="min-w-0 flex-1">
                           <p className="truncate text-sm font-medium">
                              {file.name}
                           </p>
                           <p className="text-muted-foreground text-xs">
                              {formatFileSize(file.size)}
                           </p>
                        </div>
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => removeFile(file.key)}
                           className="hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
