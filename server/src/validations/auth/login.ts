import { z } from "zod";

export const loginValidationSchema = z
  .object({
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

export type loginValidationSchema = z.infer<typeof loginValidationSchema>;

const loginValidation = (payload: unknown) => {
  const result = loginValidationSchema.safeParse(payload);
  return result;
};

export default loginValidation;
