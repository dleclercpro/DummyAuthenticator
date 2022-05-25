import { Router } from 'express';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';



const router = Router();



router.post(`/sign-up`, SignUpController);
router.post(`/sign-in`, SignInController);
router.get(`/sign-out`, SignOutController);



export default router;