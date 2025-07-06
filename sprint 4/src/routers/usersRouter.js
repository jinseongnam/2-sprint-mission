import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { registerUser } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.post('/register', withAsync(registerUser));

export default usersRouter;