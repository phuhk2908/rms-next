import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface SubmitButtonProps {
   text?: string;
   textLoading?: string;
   isLoading?: boolean;
   className?: string;
}

export function SubmitButton({
   text = "Submit",
   textLoading = "Submitting...",
   isLoading,
   className,
}: SubmitButtonProps) {
   return (
      <Button disabled={isLoading} className={className}>
         {isLoading && <Loader2 className="size-4 animate-spin" />}
         {isLoading ? textLoading : text}
      </Button>
   );
}
