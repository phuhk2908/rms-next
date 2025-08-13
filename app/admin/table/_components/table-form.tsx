"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tableSchema } from "@/schemas/table";
import { createTable, deleteTable } from "@/actions/table";
import { toast } from "sonner";
import { z } from "zod";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Form,
   FormField,
   FormItem,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { TableStatus } from "@/lib/generated/prisma";

const formSchema = z.object({
   tables: z.array(tableSchema),
});

export type TableFormValues = z.infer<typeof formSchema>;
export type SingleTableValues = z.infer<typeof tableSchema>;

interface TableFormProps {
   data: SingleTableValues[];
}

export default function TableForm({ data }: TableFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();
   const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: { tables: data },
   });

   const { fields, append, remove, replace } = useFieldArray({
      control: form.control,
      name: "tables",
      keyName: "uid",
   });

   const handleDelete = async (index: number, tableId: string) => {
      if (tableId) {
         const result = await deleteTable(tableId);
         console.log(result);
         if (result.status === "success") {
            toast.success("Deleted successfully");
            remove(index);
            router.refresh();
         } else {
            toast.success("Deleted2 successfully");
            remove(index);
         }
      }
   };

   useEffect(() => {
      if (data?.length) {
         replace(data);
      }
   }, [data, replace]);

   async function onSubmit(values: TableFormValues) {
      setIsSubmitting(true);
      try {
         await Promise.all(values.tables.map((table) => createTable(table)));
         toast.success("All tables saved successfully");
      } catch (error) {
         if (error instanceof Error) {
            console.log(error);
            toast.error("Error submitting form");
         }
      } finally {
         setIsSubmitting(false);
      }
   }

   return (
      <div className="p-4">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {fields.map((field, index) => {
                        return (
                           <TableRow key={field.id}>
                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`tables.${index}.tableNumber`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                placeholder="A1, B2..."
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>
                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`tables.${index}.capacity`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Input
                                                type="number"
                                                placeholder="Số người"
                                                value={
                                                   field.value
                                                      ? String(field.value)
                                                      : ""
                                                }
                                                onChange={(e) =>
                                                   field.onChange(
                                                      e.target.value,
                                                   )
                                                }
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>
                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`tables.${index}.status`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <Select
                                             value={field.value}
                                             onValueChange={field.onChange}
                                          >
                                             <FormControl>
                                                <SelectTrigger>
                                                   <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                {Object.keys(TableStatus).map(
                                                   (status) => (
                                                      <SelectItem
                                                         key={status}
                                                         value={status}
                                                      >
                                                         {status}
                                                      </SelectItem>
                                                   ),
                                                )}
                                             </SelectContent>
                                          </Select>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>
                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`tables.${index}.isActive`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                             />
                                          </FormControl>
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>
                              <TableCell>
                                 <FormField
                                    control={form.control}
                                    name={`tables.${index}.qrCodeUrl`}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormControl>
                                             <Input
                                                {...field}
                                                placeholder="QR Code URL"
                                                value={field.value || ""}
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </TableCell>
                              <TableCell>
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                       handleDelete(index, field.id as string)
                                    }
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
               <div className="mt-4 flex gap-2">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() =>
                        append({
                           id: "",
                           tableNumber: "",
                           capacity: 2,
                           status: TableStatus.AVAILABLE,
                           qrCodeUrl: "",
                           isActive: true,
                        })
                     }
                  >
                     <PlusCircle className="mr-2 h-4 w-4" />
                     New Table
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
}
