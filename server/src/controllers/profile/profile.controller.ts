import { type Request, type Response } from "express";
import { db } from "../../db/config/connection";
import { usersTable } from "../../db/models";
import { eq } from "drizzle-orm";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";

const userProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized.");
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, userId));

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const { password: _password, ...userData } = user;

    return res
      .status(200)
      .json(new ApiResponse(200, "User details fetched successfully.", userData));
  },
);

export default userProfileController;
