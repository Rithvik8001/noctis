import { Router } from "express";

import signupRoute from "./signup";
import loginRoute from "./login";
import logoutRoute from "./logout";

const route: Router = Router();

route.use("/", signupRoute);
route.use("/", loginRoute);
route.use("/", logoutRoute);

export default route;
