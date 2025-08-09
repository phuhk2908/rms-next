"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarDayButton } from "@/components/ui/calendar";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2, Github, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
   const router = useRouter();
   const [githubPending, startGithubTransition] = useTransition();
   const [emailPending, startEmailTransition] = useTransition();
   const [passwordPending, startPasswordTransition] = useTransition();

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [signInType, setSignInType] = useState<"otp" | "password">("otp");

   function signInWithGithub() {
      startGithubTransition(async () => {
         await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
            fetchOptions: {
               onSuccess: () => {
                  toast.success(
                     "Signed in with Github, you will be redirected...",
                  );
               },
               onError: (ctx) => {
                  toast.error(ctx.error.message);
               },
            },
         });
      });
   }

   function signInWithEmail() {
      startEmailTransition(async () => {
         await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "sign-in",
            fetchOptions: {
               onSuccess: () => {
                  toast.success("Email sent");
                  router.push(`/verify?email=${email}`);
               },
               onError: (ctx) => {
                  toast.error(ctx.error.message);
               },
            },
         });
      });
   }

   function signInWithPassword() {
      startPasswordTransition(async () => {
         await authClient.signIn.email({
            email: email,
            password: password,
            fetchOptions: {
               onSuccess: () => {
                  toast.success("Signed in successfully");
                  router.push("/");
               },
               onError: (ctx) => {
                  if (ctx.error.status === 403) {
                     toast.error("Please verify your email address");
                  }
                  toast.error(ctx.error.message);
               },
            },
         });
      });
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-xl">Welcome back!</CardTitle>
            <CardDescription>
               Login with your Github Email account
            </CardDescription>
         </CardHeader>
         <CardContent className="flex flex-col gap-4">
            <Button
               disabled={githubPending}
               onClick={signInWithGithub}
               className="w-full cursor-pointer"
               variant="outline"
            >
               {githubPending ? (
                  <>
                     <Loader2 className="size-4 animate-spin" />
                     <span>Loading...</span>
                  </>
               ) : (
                  <>
                     <Github className="size-4" />
                     Sign in with Github
                  </>
               )}
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
               <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
               </span>
            </div>

            <div className="grid gap-3">
               <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                     <Label htmlFor="email">Email</Label>
                     {signInType === "otp" ? (
                        <button
                           type="button"
                           onClick={() => setSignInType("password")}
                           disabled={emailPending || passwordPending}
                           className="text-sm font-medium underline-offset-4 hover:underline"
                        >
                           Login with password
                        </button>
                     ) : (
                        <button
                           type="button"
                           onClick={() => setSignInType("otp")}
                           disabled={emailPending || passwordPending}
                           className="text-sm font-medium underline-offset-4 hover:underline"
                        >
                           Login with otp
                        </button>
                     )}
                  </div>
                  <Input
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     type="email"
                     placeholder="john.doe@example.com"
                  />
               </div>

               {signInType === "password" && (
                  <div className="grid gap-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                     </div>
                     <Input
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder=""
                     />
                  </div>
               )}

               {signInType === "otp" ? (
                  <Button
                     disabled={emailPending}
                     type="button"
                     onClick={signInWithEmail}
                     className="cursor-pointer"
                  >
                     {emailPending ? (
                        <>
                           <Loader2 className="size-4 animate-spin" />
                           <span>Loading...</span>
                        </>
                     ) : (
                        <>
                           <Send className="size-4" />
                           Continue with Email
                        </>
                     )}
                  </Button>
               ) : (
                  <Button
                     disabled={passwordPending}
                     type="button"
                     onClick={signInWithPassword}
                     className="cursor-pointer"
                  >
                     {passwordPending ? (
                        <>
                           <Loader2 className="size-4 animate-spin" />
                           <span>Loading...</span>
                        </>
                     ) : (
                        <>
                           <Send className="size-4" />
                           Sign In
                        </>
                     )}
                  </Button>
               )}

               <p className="text-muted-foreground text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                     className="text-primary hover:underline"
                     href="/sign-up"
                  >
                     Sign up
                  </Link>
               </p>
            </div>
         </CardContent>
      </Card>
   );
}
