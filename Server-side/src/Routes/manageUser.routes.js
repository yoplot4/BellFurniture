import express from 'express';
// import the controller

import { getAllUsersController } from '../controller/manageUser.controller.js';

// import the middleware validate user role

//import { verifyToken } from '../middleware/auth.middleware';

// create the route for users

const userRoute= express.Router();

userRoute.get('/manage-users/users', getAllUsersController );


export { userRoute}