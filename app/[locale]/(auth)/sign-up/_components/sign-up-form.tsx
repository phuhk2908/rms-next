"use client";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SignUpForm() {
   const [signInPending, startSignInTransition] = useTransition();
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const router = useRouter();

   function signInWithCredentials() {
      startSignInTransition(async () => {
         await authClient.signUp.email({
            name: name,
            email: email,
            password: password,
            fetchOptions: {
               onSuccess: () => {
                  toast.success("Signed up successfully");
                  router.push("/");
               },
               onError: (ctx) => {
                  toast.error(ctx.error.message);
               },
            },
         });
      });
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>Sign up your account</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="grid gap-3">
               <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     type="text"
                     placeholder="johndoe"
                  />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     type="email"
                     placeholder="john.doe@example.com"
                  />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     type="password"
                  />
               </div>

               <Button disabled={signInPending} onClick={signInWithCredentials}>
                  {signInPending ? (
                     <>
                        <Loader2 className="size-4 animate-spin" />
                        Loading...
                     </>
                  ) : (
                     "Sign Up"
                  )}
               </Button>

               <p className="text-muted-foreground text-center text-sm">
                  Already have an account?{" "}
                  <Link
                     className="text-primary hover:underline"
                     href="/sign-in"
                  >
                     Sign in
                  </Link>
               </p>
            </div>
         </CardContent>
      </Card>
   );
}
