import { Router } from 'express';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';
import { RequestMiddleware } from '../middleware/RequestMiddleware';



const router = Router();



// MIDDLEWARE
router.use(RequestMiddleware);



// ROUTES
router.post(`/sign-up`, SignUpController);
router.put(`/sign-in`, SignInController);
router.get(`/sign-out`, SignOutController);



export default router;