import express from 'express';
import { validateRegister, loginValidater } from '../middleware/auth.middleware.js';
import { registerController, loginController } from '../controller/auth.controller.js';


const authRoute= express.Router();
authRoute.post('/auth/register',validateRegister, registerController);
authRoute.post('/auth/login',loginValidater, loginController)


export { authRoute };