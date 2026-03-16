import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import chatRoute from "./chat";

const route: Router = Router();

route.use(authMiddleware);
route.use("/", chatRoute);

export default route;
