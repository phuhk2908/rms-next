import { createAccessControl } from "better-auth/plugins/access";

const statement = {
   menu: ["read", "create", "update", "delete"],
   staff: ["read", "create", "update", "delete"],
   customer: ["read", "create", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

export const customer = ac.newRole({ customer: ["read"] });
export const staff = ac.newRole({
   staff: ["read", "create", "update"],
   customer: ["read"],
});
export const manager = ac.newRole({
   staff: ["read", "create", "update", "delete"],
   customer: ["read", "create", "update"],
   menu: ["read", "create", "update"],
});
export const admin = ac.newRole({
   menu: ["read", "create", "update", "delete"],
   staff: ["read", "create", "update", "delete"],
   customer: ["read", "create", "update", "delete"],
});
