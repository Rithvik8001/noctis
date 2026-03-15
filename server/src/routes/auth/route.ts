import { Router } from "express";
import signupRoute from "./signup";
import loginRoute from "./login";

const route: Router = Router();

route.use("/", signupRoute);
route.use("/", loginRoute);

export default route;
