import { type Request, type Response } from "express";
import signupValidation from "../../validations/auth/signup.js";
import { db } from "../../db/config/connection.js";
import { usersTable } from "../../db/models/users.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";

const signupController = asyncHandler(async (req: Request, res: Response) => {
  const result = signupValidation(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "Invalid data.",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  const { userName, email, password } = result.data;

  const [userConflict] = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.email, email), eq(usersTable.userName, userName)))
    .limit(1);

  if (userConflict) {
    const isEmailConflict = userConflict.email === email;
    throw new ApiError(
      409,
      isEmailConflict ? "Email already taken." : "Username already taken.",
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(usersTable)
    .values({ userName, email, password: hashPassword })
    .returning();

  if (!newUser) {
    throw new ApiError(500, "Failed to create user.");
  }

  const { password: _password, ...userData } = newUser;

  return res
    .status(201)
    .json(new ApiResponse(201, "Signup successful.", userData));
});

export default signupController;
