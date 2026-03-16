import { type Request, type Response } from "express";
import loginValidation from "../../validations/auth/login";
import { db } from "../../db/config/connection";
import { usersTable } from "../../db/models";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";

const loginController = asyncHandler(async (req: Request, res: Response) => {
  const result = loginValidation(req.body);
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

  const { email, password } = result.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const expiryTime = 7 * 24 * 60 * 60; // 7d

  const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET as string,
    { expiresIn: expiryTime },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: expiryTime * 1000,
    secure: process.env.NODE_ENV === "production",
  });

  const { password: _, ...userData } = user;

  return res
    .status(200)
    .json(new ApiResponse(200, "Login successful.", { user: userData }));
});

export default loginController;
