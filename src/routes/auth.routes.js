import {Router} from "express";
import { verifyJwtAccessToken ,verifyJwtRefreshToken} from "../middlewares/auth.middleware.js";
import { loginUser, logOutUser, refreshAccessTokens, registerUser, verifyEmail } from "../controllers/auth.controller.js";
const authRouter = Router();
authRouter.route("/register").post(registerUser)
authRouter.route("/verifyEmail").post(verifyEmail)
authRouter.route("/login").post(loginUser)
authRouter.route("/logout").get(verifyJwtRefreshToken,logOutUser);
authRouter.route("/refreshAccessToken").get(verifyJwtRefreshToken,refreshAccessTokens)

export default authRouter;