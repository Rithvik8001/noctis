import { type Request, type Response } from "express";

const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV == `production`,
    sameSite: `strict`,
  });
};

export default logoutController;
