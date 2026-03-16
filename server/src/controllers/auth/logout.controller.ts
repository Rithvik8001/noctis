import { type Request, type Response } from "express";

const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV == `production`,
    sameSite: `strict`,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export default logoutController;
