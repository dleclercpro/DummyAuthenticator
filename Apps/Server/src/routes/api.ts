import { Router } from 'express';
import GetSecretController from '../controllers/GetSecretController';
import PingController from '../controllers/PingController';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';
import { SessionMiddleware } from '../middleware/SessionMiddleware';



const ApiRouter = Router();



// ROUTES

// Authentication
ApiRouter.post(`/sign-up`, [], SignUpController);
ApiRouter.put(`/sign-in`, [], SignInController);
ApiRouter.get(`/sign-out`, [SessionMiddleware], SignOutController);
ApiRouter.get('/ping', [SessionMiddleware], PingController);

// Secret
ApiRouter.put('/secret', [SessionMiddleware], GetSecretController);



export default ApiRouter;