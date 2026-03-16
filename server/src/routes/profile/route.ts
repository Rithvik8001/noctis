import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import userProfileRoute from "./user-profile";

const route: Router = Router();

route.use(authMiddleware);
route.use("/", userProfileRoute);

export default route;
