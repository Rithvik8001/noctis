import { type Request, type Response, type NextFunction } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { db } from "../db/config/connection";
import { usersTable } from "../db/models";
import { eq } from "drizzle-orm";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }

  const decodedToken = jwt.verify(token, secret as Secret, {
    algorithms: ["HS256"],
  }) as { userId: string };

  const [user] = await db
    .select({ userId: usersTable.userId })
    .from(usersTable)
    .where(eq(usersTable.userId, decodedToken.userId));

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  req.userId = user.userId;
  next();
};

export default authMiddleware;
