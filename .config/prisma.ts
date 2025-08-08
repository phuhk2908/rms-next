import { PrismaConfig } from "@/types";
import path from "node:path";
// import type { PrismaConfig } from "prisma";

export default {
   experimental: {
      adapter: true,
      externalTables: true,
      studio: true,
   },
   schema: path.join("db", "schema.prisma"),
   migrations: {
      path: path.join("db", "migrations"),
      seed: "tsx prisma/seed.ts",
      initShadowDb: "",
   },
   views: {
      path: path.join("db", "views"),
   },
   typedSql: {
      path: path.join("db", "queries"),
   },
} satisfies PrismaConfig;
