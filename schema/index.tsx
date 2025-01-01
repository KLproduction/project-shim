import { min } from "date-fns";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address.") // Ensures it's a valid email
    .nonempty("Email is required."), // Ensures the field is not empty

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.") // Minimum length requirement
    .max(20, "Password must be at most 20 characters long.") // Maximum length constraint
    .nonempty("Password is required."), // Ensures the field is not empty
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long.")
      .max(50, "Name must be at most 50 characters long.")
      .nonempty("Name is required."),
    email: z
      .string()
      .email("Invalid email address.")
      .nonempty("Email is required."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .max(20, "Password must be at most 20 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      )
      .nonempty("Password is required."),
    confirmPassword: z.string().nonempty("Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Path of the error
    message: "Passwords must match.",
  });
export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Workspace name is required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((url) => (url === "" ? undefined : url)),
    ])
    .optional(),
});
export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((url) => (url === "" ? undefined : url)),
    ])
    .optional(),
});
