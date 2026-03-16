import { Router } from "express";
import chatController from "../../controllers/agent/chat.controller";

const route: Router = Router();

route.post("/chat", chatController);

export default route;
