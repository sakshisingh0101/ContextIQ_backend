import {Router} from "express";
import { getConversation,createConversation, sendMessage} from "../controllers/chat.controller.js";
import { verifyJwtAccessToken,verifyJwtRefreshToken } from "../middlewares/auth.middleware.js";

const chatRouter = Router();
chatRouter.route("/createConversation").post(verifyJwtAccessToken,createConversation);
chatRouter.route("/sendMessage/:conversationId").post(verifyJwtAccessToken,sendMessage);
chatRouter.route("/getConversation/:conversationId").get(verifyJwtAccessToken,getConversation);

export default chatRouter;
