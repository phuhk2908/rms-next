export type ApiResponse = {
   status: "success" | "error";
   message: string;
   errors?: any;
};
