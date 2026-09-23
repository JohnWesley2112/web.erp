// src/router/roles.ts

export const ROLE_IDS = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    PRINCIPAL: 3,
    ACADEMIC_ADMIN: 4,
    TEACHER: 5,
    ACCOUNTANT: 6,
    LIBRARIAN: 7,
    STUDENT: 8,
    PARENT: 9
} as const;

export type RoleId = typeof ROLE_IDS[keyof typeof ROLE_IDS];