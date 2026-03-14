import { Router } from "express";
import signupRoute from "./signup.js";

const route: Router = Router();

route.use("/", signupRoute);

export default route;
