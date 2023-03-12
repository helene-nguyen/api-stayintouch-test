//~ Import Router 
import { Router } from 'express';
const router = Router();

//~ Main
import {router as mainRouter} from './main.js';
router.use(mainRouter);

//~ User
import {router as userRouter} from './user.js';
router.use(userRouter);

//~ Export router
export { router };