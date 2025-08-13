import { env } from "@/lib/env";

export function useConstructUrl(key: string): string {
   return `${env.NEXT_PUBLIC_UPLOADTHING_PRE_URL}/${key}`;
}
