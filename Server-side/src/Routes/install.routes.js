import express from 'express';
import { installController } from '../controller/install.controller.js';

const installRout = express.Router();

  installRout.get('/install', installController)
export { installRout};