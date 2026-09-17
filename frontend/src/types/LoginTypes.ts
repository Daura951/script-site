import z from "zod";

export const SignupRequest = z.object({
  username: z.string().min(10, "Username must be at least 10 characters"),
  email: z.email(),
  password: z.string().min(10, "password must be at least 10 characters"),
});
export type SignupRequest = z.infer<typeof SignupRequest>;
