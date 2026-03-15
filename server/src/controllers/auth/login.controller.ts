import { type Request, type Response } from "express";
import loginValidation from "../../validations/auth/login";
import { db } from "../../db/config/connection";
import { usersTable } from "../../db/models";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const loginController = async (req: Request, res: Response) => {
  const result = loginValidation(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid data.",
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { email, password } = result.data;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
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
      maxAge: expiryTime,
      secure: process.env.NODE_ENV == "production",
    });

    const { password: _, ...userData } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default loginController;
