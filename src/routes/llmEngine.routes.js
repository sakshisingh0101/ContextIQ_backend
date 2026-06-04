import {Router} from "express"
import { verifyJwtAccessToken,verifyJwtRefreshToken } from "../middlewares/auth.middleware.js"
import { uploadDocument ,getDocuments} from "../controllers/llmEngine.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
const llmRouter=Router();
llmRouter.route("/uploadDocument").post(verifyJwtAccessToken,upload.single("document"),uploadDocument);
llmRouter.route("/getDocuments").get(verifyJwtAccessToken, getDocuments);
export default llmRouter;