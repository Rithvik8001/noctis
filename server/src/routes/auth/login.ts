import { Router } from "express";
import loginController from "../../controllers/auth/login.controller";

const route: Router = Router();

route.post("/login", loginController);

export default route;
