import { User } from "@prisma/client";

export type CreateUserDto = Pick<User, "name" | "email" | "password">;
export type UpdateUserDto = Pick<User, "name" | "email" | "password" | "avatarUrl">;
export type UserDto = Omit<User, "password">;
export type TypeUser = "CLIENT" | "ADMIN";
