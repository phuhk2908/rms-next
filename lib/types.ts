import { ZodError } from "zod";

export type ApiResponse = {
   status: "success" | "error";
   message: string;
   errors?: ZodError | any;
};
