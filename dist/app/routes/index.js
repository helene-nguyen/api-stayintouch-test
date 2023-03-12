import { Router } from 'express';
const router = Router();
import { router as mainRouter } from './main.js';
router.use(mainRouter);
import { router as userRouter } from './user.js';
router.use(userRouter);
export { router };
//# sourceMappingURL=index.js.map