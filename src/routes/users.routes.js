import {Router} from 'express';
import { getProfile,changepassword,deleteAllDocuments,deleteDocumentById,updateProfile } from '../controllers/users.controller.js';
import { deleteModel } from 'mongoose';
import { verifyJwtAccessToken } from '../middlewares/auth.middleware.js';

const userRouter=Router();
userRouter.route('/profile').get(verifyJwtAccessToken,getProfile);
userRouter.route('/updateProfile').put(verifyJwtAccessToken,updateProfile);
userRouter.route('/changePassword').put(verifyJwtAccessToken,changepassword);
userRouter.route('/deletedocumentsById/:documentId').delete(verifyJwtAccessToken,deleteDocumentById);
userRouter.route('/deleteAllDocuments').delete(verifyJwtAccessToken,deleteAllDocuments);
export default userRouter;