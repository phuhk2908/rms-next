import { PrismaClient } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export interface QueryOptions {
   fields?: string[] | Record<string, boolean> | "*";
   include?: Record<string, any>;
   where?: Record<string, any>;
   orderBy?: Record<string, any> | Record<string, any>[];
   limit?: number;
   offset?: number;
   distinct?: string[];
}

interface PaginatedResult<T> {
   data: T[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
}

/**
 * Builds the 'select' and 'include' objects for a Prisma query based on a list of fields.
 * This allows for dynamically selecting fields, including nested relations.
 *
 * @param fields - An array of strings representing the fields to select.
 * @returns An object containing the 'select' and 'include' properties for a Prisma query.
 */
function buildSelectInclude(fields: string[]) {
   const select: any = {};
   const include: any = {};

   for (const field of fields) {
      if (field.includes(".")) {
         const [relation, ...nestedPath] = field.split(".");
         let current = include;

         if (!current[relation]) {
            current[relation] = { select: {} };
         }
         current = current[relation].select;

         for (let i = 0; i < nestedPath.length - 1; i++) {
            const part = nestedPath[i];
            if (!current[part]) {
               current[part] = { select: {} };
            }
            current = current[part].select;
         }
         current[nestedPath[nestedPath.length - 1]] = true;
      } else {
         select[field] = true;
      }
   }

   return {
      select: Object.keys(select).length > 0 ? select : undefined,
      include: Object.keys(include).length > 0 ? include : undefined,
   };
}

/**
 * Constructs the Prisma query options object based on the provided QueryOptions.
 *
 * @param options - The query options.
 * @returns A Prisma-compatible query options object.
 */
function buildQueryArgs(options: QueryOptions): any {
   const { fields, include, where, orderBy, limit, offset, distinct } = options;
   const queryArgs: any = {};

   if (fields) {
      if (fields === "*") {
         if (include) queryArgs.include = include;
      } else if (Array.isArray(fields)) {
         const { select, include: autoInclude } = buildSelectInclude(fields);
         if (select) queryArgs.select = select;
         if (autoInclude) {
            queryArgs.include = include
               ? { ...autoInclude, ...include }
               : autoInclude;
         } else if (include) {
            queryArgs.include = include;
         }
      } else {
         queryArgs.select = fields;
         if (include) queryArgs.include = include;
      }
   } else if (include) {
      queryArgs.include = include;
   }

   if (where) queryArgs.where = where;
   if (orderBy) queryArgs.orderBy = orderBy;
   if (limit) queryArgs.take = limit;
   if (offset) queryArgs.skip = offset;
   if (distinct) queryArgs.distinct = distinct;

   return queryArgs;
}

/**
 * A generic Prisma query helper for fetching multiple records with dynamic options.
 */
export async function queryData<T>(
   model: keyof PrismaClient,
   options: QueryOptions = {},
): Promise<T[]> {
   const queryArgs = buildQueryArgs(options);
   // @ts-ignore - Dynamic model access
   return await prisma[model].findMany(queryArgs);
}

/**
 * A generic Prisma query helper for fetching paginated records.
 */
export async function queryDataPaginated<T>(
   model: keyof PrismaClient,
   options: QueryOptions & { page?: number; pageSize?: number } = {},
): Promise<PaginatedResult<T>> {
   const { page = 1, pageSize = 10, where, distinct } = options;
   const offset = (page - 1) * pageSize;

   const queryArgs = buildQueryArgs({ ...options, limit: pageSize, offset });

   // @ts-ignore - Dynamic model access
   const [data, total] = await Promise.all([
      (prisma[model] as any).findMany(queryArgs),
      (prisma[model] as any).count({ where, distinct }),
   ]);

   return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
   };
}
