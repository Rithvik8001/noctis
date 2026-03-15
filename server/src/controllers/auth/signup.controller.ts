import { type Request, type Response } from "express";
import signupValidation from "../../validations/auth/signup.js";
import { db } from "../../db/config/connection.js";
import { usersTable } from "../../db/models/users.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";

const signupController = async (req: Request, res: Response) => {
  const result = signupValidation(req.body);
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

  const { userName, email, password } = result.data;

  try {
    const [userConflict] = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.userName, userName)))
      .limit(1);

    if (userConflict) {
      const isEmailConflict = userConflict.email === email;
      return res.status(409).json({
        success: false,
        message: isEmailConflict
          ? "Email already taken"
          : "userName already taken.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(usersTable)
      .values({
        userName,
        email,
        password: hashPassword,
      })
      .returning();

    const checkIfUserisCreated = newUser[0];

    if (!checkIfUserisCreated) {
      return res.status(500).json({
        success: false,
        message: "Failed to signup user",
      });
    }

    const { password: excludePassword, ...newUserResponse } =
      checkIfUserisCreated;

    return res.status(201).json({
      success: true,
      message: "Signup successful.",
      data: newUserResponse,
    });
  } catch (error) {
    console.log("Server error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export default signupController;
