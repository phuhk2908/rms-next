import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
   locales: ["en", "vi"],
   defaultLocale: "en",
   localePrefix: "always",
   pathnames: {
      "/": "/",
      "/verify": "verify",
      "/sign-in": "/sign-in",
      "/access-denied": "/access-denied",
      "/admin": "/admin",
      "/admin/dashboard": "/admin/dashboard",
      "/admin/recipes": "/admin/recipes",
      "/admin/menu/items": "/admin/menu/items",
      "/admin/shift": "/admin/shift",
      "/admin/ingredients": {
         vi: "/admin/nguyen-lieu",
      },
   },
});
