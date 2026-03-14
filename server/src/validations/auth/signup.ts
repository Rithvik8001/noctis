import { z } from "zod";

export const signupValidationSchema = z
  .object({
    userName: z.string().trim(),
    email: z.email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        },
      ),
  })
  .strict();

export type signupValidationSchema = z.infer<typeof signupValidationSchema>;

const signupValidation = (payload: unknown) => {
  const result = signupValidationSchema.safeParse(payload);
  return result;
};

export default signupValidation;
