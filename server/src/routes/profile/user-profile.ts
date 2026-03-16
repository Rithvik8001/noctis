import { Router } from "express";
import userProfileController from "../../controllers/profile/profile.user";

const route: Router = Router();

route.get("/", userProfileController);

export default route;
