"use client";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyPage() {
   const router = useRouter();
   const [otp, setOtp] = useState("");
   const [otpPending, startOTPTransition] = useTransition();
   const params = useSearchParams();
   const email = params.get("email") as string;
   const isOtpCompleted = otp.length === 6;

   function verifyOTP() {
      startOTPTransition(async () => {
         await authClient.signIn.emailOtp({
            email: email,
            otp: otp,
            fetchOptions: {
               onSuccess: () => {
                  toast.success("Email verified");
                  router.push("/");
               },
               onError: (error) => {
                  console.error("Verification failed:", error);
               },
            },
         });
      });
   }

   return (
      <Card className="mx-auto w-full">
         <CardHeader className="text-center">
            <CardTitle className="text-xl">Please check your email</CardTitle>
            <CardDescription>
               We have sent a verification email code to your email address.
               Please open the email and paste the code below.
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
               <InputOTP
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  maxLength={6}
                  className="gap-2"
               >
                  <InputOTPGroup>
                     <InputOTPSlot index={0} />
                     <InputOTPSlot index={1} />
                     <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                     <InputOTPSlot index={3} />
                     <InputOTPSlot index={4} />
                     <InputOTPSlot index={5} />
                  </InputOTPGroup>
               </InputOTP>
               <p className="text-muted-foreground text-sm">
                  Enter the 6-digit code sent to your email.
               </p>
            </div>

            <Button
               onClick={verifyOTP}
               disabled={otpPending || !isOtpCompleted}
               className="w-full"
            >
               {otpPending ? (
                  <>
                     <Loader2 className="size-4 animate-spin" />
                     Verifying...
                  </>
               ) : (
                  "Verify Account"
               )}
            </Button>
         </CardContent>
      </Card>
   );
}
