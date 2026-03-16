import { type Request, type Response } from "express";
import { db } from "../../db/config/connection";
import { usersTable } from "../../db/models";
import { eq } from "drizzle-orm";

const userProfileController = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      messsage: "Unauthorized.",
    });
  }
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, userId));
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user details",
      });
    }

    const { password: _password, ...userData } = user;

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      data: userData,
    });
  } catch (error) {
    console.log(`error: `, error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export default userProfileController;
