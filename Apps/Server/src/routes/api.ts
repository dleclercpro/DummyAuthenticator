import { Router } from 'express';
import GetSecretController from '../controllers/GetSecretController';
import PingController from '../controllers/PingController';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';
import { SessionMiddleware } from '../middleware/SessionMiddleware';
import ResetPassword from '../controllers/ResetPassword';
import ForgotPassword from '../controllers/ForgotPassword';



const ApiRouter = Router();



// ROUTES

// Authentication
ApiRouter.post(`/sign-up`, [], SignUpController);
ApiRouter.put(`/sign-in`, [], SignInController);
ApiRouter.get(`/sign-out`, [SessionMiddleware], SignOutController);
ApiRouter.post(`/forgot-password`, [], ForgotPassword);
ApiRouter.post(`/reset-password`, [], ResetPassword);
ApiRouter.get('/ping', [SessionMiddleware], PingController);

// Secret
ApiRouter.get('/secret', [SessionMiddleware], GetSecretController);



export default ApiRouter;