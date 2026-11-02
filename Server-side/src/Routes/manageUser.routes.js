import express from 'express';
// import the controller

import { getAllUsersController,updateUserController, deleteUserController } from '../controller/manageUser.controller.js';

import { validateRegister } from '../middleware/auth.middleware.js';
import { registerController } from '../controller/auth.controller.js';

// import the middleware validate user role

//import { verifyToken } from '../middleware/auth.middleware';

// create the route for users

const userRoute= express.Router();

userRoute.get('/manage-users/users', getAllUsersController );

userRoute.post('/manage-users/register',validateRegister, registerController);
userRoute.patch('/manage-users/:id', updateUserController)

userRoute.delete('/manage-users/:id', deleteUserController);
export { userRoute}