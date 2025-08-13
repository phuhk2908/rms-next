"use client";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, Mail } from "lucide-react";

export function AccessDeniedComp() {
   return (
      <div className="flex min-h-screen items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
               </div>
               <CardTitle className="text-muted-foreground text-2xl font-bold">
                  Access Denied
               </CardTitle>
               <CardDescription className="text-gray-500">
                  You don&apos;t have permission to access this resource
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="text-muted-foreground text-center text-sm">
                  <p>
                     This page is restricted. Please contact your administrator
                     if you believe you should have access to this content.
                  </p>
               </div>

               <div className="space-y-2">
                  <Button
                     variant="default"
                     className="w-full"
                     onClick={() => window.history.back()}
                  >
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Go Back
                  </Button>

                  <Button
                     variant="outline"
                     className="w-full bg-transparent"
                     onClick={() => (window.location.href = "/")}
                  >
                     <Home className="mr-2 h-4 w-4" />
                     Return Home
                  </Button>

                  <Button
                     variant="ghost"
                     className="w-full"
                     onClick={() =>
                        (window.location.href = "mailto:support@company.com")
                     }
                  >
                     <Mail className="mr-2 h-4 w-4" />
                     Contact Support
                  </Button>
               </div>

               <div className="text-center">
                  <p className="text-xs text-gray-400">
                     Error Code: 403 - Forbidden
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
