import { Router } from "express";
import logoutController from "../../controllers/auth/logout.controller";

const route: Router = Router();

route.post("/logout", logoutController);

export default route;
