//~ Import Router
import { Router } from 'express';
const router = Router();

import { renderHomePage } from '../controllers/main.js';

//~ Home
router.get('/', renderHomePage);

//~ Export router
export { router };
