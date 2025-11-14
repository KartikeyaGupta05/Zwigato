import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getCurrentUser } from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.get('/current-user', authMiddleware, getCurrentUser);

export default userRouter;