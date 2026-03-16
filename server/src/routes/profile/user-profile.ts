import { Router } from "express";
import userProfileController from "../../controllers/profile/profile.controller";

const route: Router = Router();

route.get("/me", userProfileController);

export default route;
