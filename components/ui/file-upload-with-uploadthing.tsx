"use client";

import { Button } from "@/components/ui/button";
import { uploadFiles } from "@/lib/uploadthing";
import {
   FileUpload,
   FileUploadDropzone,
   FileUploadItem,
   FileUploadItemDelete,
   FileUploadItemMetadata,
   FileUploadItemPreview,
   FileUploadItemProgress,
   FileUploadList,
   type FileUploadProps,
   FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";
import type { UploadthingEndpoint } from "@/types/uploadthing";

/**
 * Configuration interface for the custom file upload component
 */
interface CustomFileUploadConfig {
   /** Maximum number of files allowed */
   maxFiles?: number;
   /** Maximum file size in bytes */
   maxSize?: number;
   /** Accepted file types */
   accept?: string;
   /** UploadThing endpoint identifier */
   endpoint?: UploadthingEndpoint;
   /** Custom upload handler */
   onUploadComplete?: (files: any[]) => void;
   /** Custom error handler */
   onError?: (error: Error) => void;
   /** Custom file rejection handler */
   onFileReject?: (file: File, reason: string) => void;
   /** Whether multiple files are allowed */
   multiple?: boolean;
   /** Custom CSS classes */
   className?: string;
   /** Whether the component is disabled */
   disabled?: boolean;
}

/**
 * Custom file upload component with enhanced functionality and type safety
 *
 * @param config - Configuration object for the file upload component
 * @returns JSX element representing the file upload component
 */
export function FileUploadWithUploadthing({
   maxFiles = 5,
   maxSize = 4 * 1024 * 1024, // 4MB default
   accept = "image/*",
   endpoint = "menuCategory",
   onUploadComplete,
   onError,
   onFileReject,
   multiple = true,
   className = "w-full max-w-md",
   disabled = false,
}: CustomFileUploadConfig) {
   const [isUploading, setIsUploading] = React.useState<boolean>(false);
   const [files, setFiles] = React.useState<File[]>([]);

   /**
    * Handles the upload process with proper error handling and progress tracking
    */
   const handleUpload: NonNullable<FileUploadProps["onUpload"]> =
      React.useCallback(
         async (filesToUpload, { onProgress }) => {
            if (!filesToUpload.length) {
               return;
            }

            try {
               setIsUploading(true);

               const uploadResult = await uploadFiles(endpoint, {
                  files: filesToUpload,
                  onUploadProgress: ({ file, progress }) => {
                     onProgress(file, progress);
                  },
               });

               // Handle successful upload
               if (onUploadComplete) {
                  onUploadComplete(uploadResult);
               } else {
                  n;
                  toast.success("Files uploaded successfully");
               }
            } catch (error) {
               handleUploadError(error);
            } finally {
               setIsUploading(false);
            }
         },
         [endpoint, onUploadComplete],
      );

   /**
    * Centralized error handling for upload operations
    */
   const handleUploadError = React.useCallback(
      (error: unknown) => {
         let errorMessage = "An unknown error occurred";

         if (error instanceof UploadThingError) {
            errorMessage =
               error.data && "error" in error.data
                  ? String(error.data.error)
                  : "Upload failed";
         } else if (error instanceof Error) {
            errorMessage = error.message;
         }

         if (onError && error instanceof Error) {
            onError(error);
         } else {
            toast.error("Upload failed", {
               description: errorMessage,
            });
         }
      },
      [onError],
   );

   /**
    * Handles file rejection with custom messaging
    */
   const handleFileReject = React.useCallback(
      (file: File, message: string) => {
         const fileName =
            file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name;

         if (onFileReject) {
            onFileReject(file, message);
         } else {
            toast.warning("File rejected", {
               description: `"${fileName}" ${message}`,
            });
         }
      },
      [onFileReject],
   );

   /**
    * Handles file acceptance and updates local state
    */
   const handleFileAccept = React.useCallback((acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
   }, []);

   /**
    * Formats file size for display
    */
   const formatFileSize = React.useCallback((bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
   }, []);

   return (
      <FileUpload
         accept={accept}
         maxFiles={maxFiles}
         maxSize={maxSize}
         className={className}
         onAccept={handleFileAccept}
         onUpload={handleUpload}
         onFileReject={handleFileReject}
         multiple={multiple}
         disabled={disabled || isUploading}
      >
         <FileUploadDropzone>
            <div className="flex flex-col items-center gap-2 text-center">
               <div className="flex items-center justify-center rounded-full border p-3">
                  <Upload className="text-muted-foreground size-6" />
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-medium">Drag & drop files here</p>
                  <p className="text-muted-foreground text-xs">
                     Or click to browse (max {maxFiles} files, up to{" "}
                     {formatFileSize(maxSize)} each)
                  </p>
               </div>
            </div>
            <FileUploadTrigger asChild>
               <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-fit"
                  disabled={disabled || isUploading}
               >
                  {isUploading ? "Uploading..." : "Browse files"}
               </Button>
            </FileUploadTrigger>
         </FileUploadDropzone>

         <FileUploadList>
            {files.map((file, index) => (
               <FileUploadItem key={`${file.name}-${index}`} value={file}>
                  <div className="flex w-full items-center gap-3">
                     <FileUploadItemPreview className="shrink-0" />
                     <FileUploadItemMetadata className="min-w-0 flex-1" />
                     <FileUploadItemDelete asChild>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="size-8 shrink-0"
                           disabled={isUploading}
                           aria-label={`Remove ${file.name}`}
                        >
                           <X className="size-4" />
                        </Button>
                     </FileUploadItemDelete>
                  </div>
                  <FileUploadItemProgress className="mt-2" />
               </FileUploadItem>
            ))}
         </FileUploadList>
      </FileUpload>
   );
}

/**
 * Example usage of the CustomFileUpload component
 */
export function CustomFileUploadDemo() {
   const handleUploadComplete = React.useCallback((files: any[]) => {
      console.log("Upload completed:", files);
   }, []);

   const handleError = React.useCallback((error: Error) => {
      console.error("Upload error:", error);
      // Custom error handling logic here
   }, []);

   const handleFileReject = React.useCallback((file: File, reason: string) => {
      console.warn("File rejected:", file.name, reason);
      // Custom file rejection handling logic here
   }, []);

   return (
      <div className="space-y-6">
         <FileUploadWithUploadthing
            maxFiles={3}
            maxSize={2 * 1024 * 1024} // 2MB
            accept="image/*"
            onUploadComplete={handleUploadComplete}
            onError={handleError}
            onFileReject={handleFileReject}
            className="w-full max-w-lg"
         />
      </div>
   );
}
