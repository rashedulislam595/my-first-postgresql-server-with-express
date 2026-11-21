export type Role = "admin" | "user" | "agent";

export const USER_ROLE = {
    admin:"admin",
    agent:"agent",
    user:"user"
} as const