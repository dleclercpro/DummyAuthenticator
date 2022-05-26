import { Router } from 'express';
import GetSecretController from '../controllers/GetSecretController';
import PingController from '../controllers/PingController';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';
import { RequestMiddleware } from '../middleware/RequestMiddleware';
import { SessionMiddleware } from '../middleware/SessionMiddleware';



const router = Router();



// MIDDLEWARE
router.use(RequestMiddleware);



// ROUTES

// Authentication
router.post(`/sign-up`, [], SignUpController);
router.put(`/sign-in`, [], SignInController);
router.get(`/sign-out`, [SessionMiddleware], SignOutController);
router.get('/ping', [SessionMiddleware], PingController);

// Secret
router.put('/secret', [SessionMiddleware], GetSecretController);



export default router;