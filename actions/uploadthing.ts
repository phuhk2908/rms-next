"use server";

import { tryCatch } from "@/helpers/try-catch";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteFiles = async (fileKeys: string | string[]) => {
   return await tryCatch(async () => {
      const keys = Array.isArray(fileKeys) ? fileKeys : [fileKeys];

      await utapi.deleteFiles(keys);

      return {
         success: true,
         deletedCount: keys.length,
         message: "Files deleted successfully",
      };
   });
};
