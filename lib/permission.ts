import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
   ...defaultStatements,
   users: ["read", "create", "update", "delete"],
   orders: ["read", "create", "update", "delete"],
   reservations: ["read", "create", "update", "delete"],
   menu: ["read", "create", "update", "delete"],
   recipes: ["read", "create", "update", "delete"],
   ingredients: ["read", "create", "update", "delete"],
   reports: ["read", "create"],
   staffs: ["read", "create", "update", "delete"],
   payments: ["read", "create"],
   leaveRequest: ["create", "read", "approve", "reject", "delete"],
   payroll: ["read", "create", "update"],
   attendance: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
   ...adminAc.statements,
   users: ["read", "create", "update", "delete"],
   orders: ["read", "create", "update", "delete"],
   reservations: ["read", "create", "update", "delete"],
   menu: ["read", "create", "update", "delete"],
   recipes: ["read", "create", "update", "delete"],
   ingredients: ["read", "create", "update", "delete"],
   reports: ["read", "create"],
   staffs: ["read", "create", "update", "delete"],
   payments: ["read", "create"],
   leaveRequest: ["create", "read", "approve", "reject", "delete"],
   payroll: ["read", "create", "update"],
   attendance: ["read", "create", "update", "delete"],
});

export const manager = ac.newRole({
   users: ["read", "create"],
   orders: ["read", "create"],
   reservations: ["read", "create"],
   menu: ["read", "create"],
   recipes: ["read", "create"],
   ingredients: ["read", "create"],
   reports: ["read", "create"],
   staffs: ["read", "create", "update", "delete"],
   payments: ["read", "create"],
   leaveRequest: ["create", "read", "approve", "reject"],
   payroll: ["read", "create"],
   attendance: ["read", "create", "update", "delete"],
});

export const staff = ac.newRole({
   orders: ["read", "create", "update"],
   reservations: ["read", "create", "update", "delete"],
   menu: ["read", "create", "update", "delete"],
   recipes: ["read", "create", "update", "delete"],
   ingredients: ["read", "create", "update", "delete"],
   reports: ["read"],
   payments: ["read"],
});

export const chef = ac.newRole({
   menu: ["read"],
   recipes: ["read"],
   ingredients: ["read"],
   orders: ["update"],
});

export const customer = ac.newRole({
   menu: ["read"],
   recipes: ["read"],
   ingredients: ["read"],
   orders: ["read"],
});
