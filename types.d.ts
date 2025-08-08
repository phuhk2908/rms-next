export declare type PrismaConfig = {
   // Whether features with an unstable API are enabled.
   experimental: {
      adapter: true;
      externalTables: true;
      studio: true;
   };

   // The path to the schema file, or path to a folder that shall be recursively searched for *.prisma files.
   schema?: string;

   // The Driver Adapter used for Prisma CLI.
   adapter?: () => Promise<SqlMigrationAwareDriverAdapterFactory>;

   // The configuration for Prisma Studio.
   studio?: {
      adapter: () => Promise<SqlMigrationAwareDriverAdapterFactory>;
   };

   // Configuration for Prisma migrations.
   migrations?: {
      path: string;
      seed: string;
      initShadowDb: string;
   };

   // Configuration for the database view entities.
   views?: {
      path: string;
   };

   // Configuration for the `typedSql` preview feature.
   typedSql?: {
      path: string;
   };
};
