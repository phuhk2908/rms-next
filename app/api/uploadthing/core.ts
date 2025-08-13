import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
   ingredient: f({
      image: {
         maxFileSize: "4MB",
         maxFileCount: 1,
      },
   })
      // Set permissions and file types for this FileRoute
      .middleware(async () => {
         const session = await auth.api.getSession({
            headers: await headers(),
         });

         if (!session) throw new UploadThingError("Unauthorized!!!");

         return { userId: session.user.id };
      })
      .onUploadComplete(async ({ metadata }) => {
         return { uploadedBy: metadata.userId };
      }),
   menuCategory: f({
      image: {
         /**
          * For full list of options and defaults, see the File Route API reference
          * @see https://docs.uploadthing.com/file-routes#route-config
          */
         maxFileSize: "4MB",
         maxFileCount: 1,
      },
   })
      // Set permissions and file types for this FileRoute
      .middleware(async () => {
         const session = await auth.api.getSession({
            headers: await headers(),
         });

         if (!session) throw new UploadThingError("Unauthorized!!!");

         // Whatever is returned here is accessible in onUploadComplete as `metadata`
         return { userId: session.user.id };
      })
      .onUploadComplete(async ({ metadata }) => {
         // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
         return { uploadedBy: metadata.userId };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
