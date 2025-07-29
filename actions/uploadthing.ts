"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteFiles = async (fileKeys: string | string[]) => {
   try {
      const keys = Array.isArray(fileKeys) ? fileKeys : [fileKeys];

      await utapi.deleteFiles(keys);

      return {
         success: true,
         deletedCount: keys.length,
         message: "Files deleted successfully",
      };
   } catch (error: any) {
      console.error("ERROR: Error deleting files", error.message);
      return {
         success: false,
         deletedCount: 0,
         message:
            error instanceof Error ? error.message : "Failed to delete files",
      };
   }
};
