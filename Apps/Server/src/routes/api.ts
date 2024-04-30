import { Router } from 'express';
import GetSecretController from '../controllers/GetSecretController';
import PingController from '../controllers/PingController';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';
import { SessionMiddleware } from '../middleware/SessionMiddleware';
import ResetPasswordController from '../controllers/ResetPasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ValidateTokenController from '../controllers/ValidateTokenController';
import ConfirmEmailController from '../controllers/ConfirmEmailController';



const ApiRouter = Router();



// ROUTES

// Authentication
ApiRouter.post(`/sign-up`, [], SignUpController);
ApiRouter.put(`/sign-in`, [], SignInController);
ApiRouter.get(`/sign-out`, [SessionMiddleware], SignOutController);
ApiRouter.put('/confirm-email', [], ConfirmEmailController);
ApiRouter.post(`/forgot-password`, [], ForgotPasswordController);
ApiRouter.post(`/reset-password`, [], ResetPasswordController);
ApiRouter.put('/token', [], ValidateTokenController);
ApiRouter.get('/ping', [SessionMiddleware], PingController);

// Secret
ApiRouter.get('/secret', [SessionMiddleware], GetSecretController);



export default ApiRouter;