import { Router } from 'express';
const router = Router();
import { doSignIn, fetchAllUsers, fetchNearbyUsers } from '../controllers/user.js';
import { auth, admin } from '../middlewares/auth.js';
import { validateToken } from '../middlewares/validateToken.js';
router.post('/api/v1/signin', doSignIn);
router.get('/api/v1/users', [validateToken, auth, admin], fetchAllUsers);
router.get('/api/v1/users/:userId(\\d+)/nearbyusers', [validateToken, auth, admin], fetchNearbyUsers);
router.get('/api/v1/users/:userId(\\d+)/nearbyusers', [validateToken, auth, admin], fetchNearbyUsers);
export { router };
//# sourceMappingURL=user.js.map