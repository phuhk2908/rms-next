import { PrismaClient } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export interface QueryOptions {
  fields?: string[] | Record<string, boolean> | "*"; // Field selection (array, object, or '*' for all)
  include?: Record<string, any>; // Relations to include
  where?: Record<string, any>; // Filter conditions
  orderBy?: Record<string, any> | Record<string, any>[]; // Sorting
  limit?: number; // Number of records
  offset?: number; // Skip records (for pagination)
  distinct?: string[]; // Distinct fields
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function buildSelectInclude(fields: string[]) {
  const select: any = {};
  const include: any = {};

  for (const field of fields) {
    if (field.includes(".")) {
      // Handle nested fields like "post.title", "user.profile.name"
      const parts = field.split(".");
      const [relation, ...nestedPath] = parts;

      if (!include[relation]) {
        include[relation] = { select: {} };
      }

      // Build nested select
      let current = include[relation].select;
      for (let i = 0; i < nestedPath.length - 1; i++) {
        const part = nestedPath[i];
        if (!current[part]) {
          current[part] = { select: {} };
        }
        current = current[part].select;
      }
      current[nestedPath[nestedPath.length - 1]] = true;
    } else {
      // Direct field
      select[field] = true;
    }
  }

  return {
    select: Object.keys(select).length > 0 ? select : undefined,
    include: Object.keys(include).length > 0 ? include : undefined,
  };
}

/**
 * Generic Prisma query helper with dynamic options
 */
export async function queryData<T>(
  model: keyof PrismaClient,
  options: QueryOptions = {}
): Promise<T[]> {
  const { fields, include, where, orderBy, limit, offset, distinct } = options;

  const queryOptions: any = {};

  if (fields) {
    if (fields === "*") {
      // Fetch all fields - don't add select, only include if provided
      if (include) queryOptions.include = include;
    } else if (Array.isArray(fields)) {
      const { select, include: autoInclude } = buildSelectInclude(fields);
      if (select) queryOptions.select = select;
      if (autoInclude) {
        queryOptions.include = include
          ? { ...autoInclude, ...include }
          : autoInclude;
      } else if (include) {
        queryOptions.include = include;
      }
    } else {
      queryOptions.select = fields;
      if (include) queryOptions.include = include;
    }
  } else {
    // No fields specified - fetch all fields
    if (include) queryOptions.include = include;
  }

  if (where) queryOptions.where = where;
  if (orderBy) queryOptions.orderBy = orderBy;
  if (limit) queryOptions.take = limit;
  if (offset) queryOptions.skip = offset;
  if (distinct) queryOptions.distinct = distinct;

  // @ts-ignore - Dynamic model access
  return await prisma[model].findMany(queryOptions);
}

/**
 * Paginated query helper
 */
export async function queryDataPaginated<T>(
  model: keyof PrismaClient,
  options: QueryOptions & { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<T>> {
  const {
    page = 1,
    pageSize = 10,
    fields,
    include,
    where,
    orderBy,
    distinct,
  } = options;

  const offset = (page - 1) * pageSize;

  const queryOptions: any = {
    take: pageSize,
    skip: offset,
  };

  if (fields) {
    if (fields === "*") {
      // Fetch all fields - don't add select, only include if provided
      if (include) queryOptions.include = include;
    } else if (Array.isArray(fields)) {
      const { select, include: autoInclude } = buildSelectInclude(fields);
      if (select) queryOptions.select = select;
      if (autoInclude) {
        queryOptions.include = include
          ? { ...autoInclude, ...include }
          : autoInclude;
      } else if (include) {
        queryOptions.include = include;
      }
    } else {
      queryOptions.select = fields;
      if (include) queryOptions.include = include;
    }
  } else {
    // No fields specified - fetch all fields
    if (include) queryOptions.include = include;
  }

  if (where) queryOptions.where = where;
  if (orderBy) queryOptions.orderBy = orderBy;
  if (distinct) queryOptions.distinct = distinct;

  // @ts-ignore - Dynamic model access
  const [data, total] = await Promise.all([
    (prisma[model] as any).findMany(queryOptions),
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
