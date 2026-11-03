import express from 'express';
// import the controller

import { getAllUsersController,updateUserController, deleteUserController } from '../controller/manageUser.controller.js';

import { validateRegister } from '../middleware/auth.middleware.js';
import { registerController } from '../controller/auth.controller.js';

// import the middleware validate user role and token

import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
// create the route for users

const userRoute= express.Router();

userRoute.get('/manage-users/users',verifyToken,authorizeRoles("admin"), getAllUsersController );

userRoute.post('/manage-users/register',validateRegister, verifyToken,authorizeRoles("admin"),registerController);
userRoute.patch('/manage-users/:id',verifyToken,authorizeRoles("admin"), updateUserController)

userRoute.delete('/manage-users/:id', verifyToken,authorizeRoles("admin"),deleteUserController);
export { userRoute}