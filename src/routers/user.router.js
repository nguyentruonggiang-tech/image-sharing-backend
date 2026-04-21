import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { protect } from '../common/middlewares/protect.middlewares.js';

const userRouter = express.Router();

userRouter.use(protect);
userRouter.get('/me', userController.getMe);

export default userRouter;