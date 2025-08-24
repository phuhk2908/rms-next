import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface Props {
   children: ReactNode;
}

export function Providers({ children }: Props) {
   return (
      <NextIntlClientProvider>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
         >
            {children}
            <Toaster position="top-right" />
         </ThemeProvider>
      </NextIntlClientProvider>
   );
}
