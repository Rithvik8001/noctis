import { type Request, type Response, type NextFunction } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { db } from "../db/config/connection";
import { usersTable } from "../db/models";
import { eq } from "drizzle-orm";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const authMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      throw new ApiError(401, "Unauthorized.");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, "Internal server error.");
    }

    let decodedToken: { userId: string };
    try {
      decodedToken = jwt.verify(token, secret as Secret, {
        algorithms: ["HS256"],
      }) as { userId: string };
    } catch {
      throw new ApiError(401, "Unauthorized.");
    }

    const [user] = await db
      .select({ userId: usersTable.userId })
      .from(usersTable)
      .where(eq(usersTable.userId, decodedToken.userId));

    if (!user) {
      throw new ApiError(401, "Unauthorized.");
    }

    req.userId = user.userId;
    next();
  },
);

export default authMiddleware;
