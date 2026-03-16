import { z } from "zod";

export const chatValidationSchema = z
  .object({
    message: z.string(),
  })
  .strict();

export type chatValidationSchema = z.infer<typeof chatValidationSchema>;

const chatValidation = (payload: unknown) => {
  const result = chatValidationSchema.safeParse(payload);
  return result;
};

export default chatValidation;
