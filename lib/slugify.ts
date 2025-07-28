import slugify from "slugify";

export const toSlug = (text: string) => slugify(text, { lower: true });
