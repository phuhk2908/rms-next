"use client";

import { Ref, useState } from "react";
import { Button } from "./ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploaderProps {
   value?: string;
   onChange?: (value: string) => void;
   onRemove?: () => void;
   disabled?: boolean;
   endpoint: "menuCategory";
   className?: string;
   accept?: {
      "image/*": string[];
   };
   maxSize?: string;
   placeholder?: {
      title?: string;
      description?: string;
      button?: string;
   };
   ref?: Ref<HTMLInputElement>;
}

export function FileUploader({
   value,
   onChange,
   onRemove,
   disabled = false,
   endpoint = "menuCategory",
   className,
   placeholder = {},
   ref,
   ...props
}: FileUploaderProps) {
   const [isUploading, setIsUploading] = useState(false);

   const {
      title = "Choose image or drag and drop",
      description = "PNG, JPG, JPEG up to 4MB",
      button = "Choose Image",
   } = placeholder;

   const handleRemove = () => {
      if (onRemove) {
         onRemove();
      } else if (onChange) {
         onChange("");
      }
   };

   if (value) {
      return (
         <div ref={ref} className={cn("group relative", className)}>
            <div className="border-muted-foreground/25 bg-muted/50 relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed">
               <img
                  src={value}
                  alt="Uploaded file"
                  className="h-full w-full object-cover"
               />
               {!disabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                     <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                        className="shadow-lg"
                     >
                        <X className="size-4" />
                        Remove
                     </Button>
                  </div>
               )}
            </div>
         </div>
      );
   }

   return (
      <div ref={ref} className={cn("w-full", className)}>
         <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
               if (res && res[0] && onChange) {
                  onChange(res[0].url);
                  toast.success("File uploaded successfully!");
               }
               setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
               toast.error(`Upload failed: ${error.message}`);
               setIsUploading(false);
            }}
            onUploadBegin={() => {
               setIsUploading(true);
            }}
            disabled={disabled || isUploading}
            appearance={{
               container: cn(
                  "border-2 border-dashed rounded-lg transition-colors duration-200 p-6",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "focus-within:border-primary focus-within:bg-primary/5",
                  disabled || isUploading
                     ? "opacity-50 cursor-not-allowed border-muted-foreground/25"
                     : "border-muted-foreground/25",
               ),
               uploadIcon: "text-muted-foreground mb-4",
               label: "text-sm font-medium text-foreground mb-2",
               allowedContent: "text-xs text-muted-foreground mb-4",
               button: cn(
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
               ),
            }}
            content={{
               uploadIcon: isUploading ? (
                  <Loader2 className="size-10 animate-spin" />
               ) : (
                  <ImageIcon className="size-10" />
               ),
               label: isUploading ? "Uploading..." : title,
               allowedContent: description,
               button: isUploading ? "Uploading..." : button,
            }}
            {...props}
         />
      </div>
   );
}
