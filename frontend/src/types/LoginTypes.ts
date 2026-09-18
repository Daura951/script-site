import z from "zod";

export const SignupRequest = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email(),
  password: z.string().min(10, "password must be at least 10 characters"),
  discordId: z.string(),
});
export type SignupRequest = z.infer<typeof SignupRequest>;

export const LoginRequest = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const User = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
});
export type User = z.infer<typeof User>;
