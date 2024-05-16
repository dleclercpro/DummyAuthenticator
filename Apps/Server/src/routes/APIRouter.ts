import { Router } from 'express';
import GetSecretController from '../controllers/GetSecretController';
import PingController from '../controllers/PingController';
import SignInController from '../controllers/SignInController';
import SignOutController from '../controllers/SignOutController';
import SignUpController from '../controllers/SignUpController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ConfirmEmailController from '../controllers/ConfirmEmailController';
import ValidateTokenController from '../controllers/ValidateTokenController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import FlushDatabaseController from '../controllers/FlushDatabaseController';
import DeleteUserController from '../controllers/DeleteUserController';
import GetUsersController from '../controllers/GetUsersController';
import StopServerController from '../controllers/StopServerController';



const APIRouter = Router();



// ROUTES

// Authentication
APIRouter.post(`/sign-up`, [], SignUpController);
APIRouter.put(`/sign-in`, [], SignInController);
APIRouter.get(`/sign-out`, [AuthMiddleware], SignOutController);
APIRouter.put('/confirm-email', [], ConfirmEmailController);
APIRouter.post(`/forgot-password`, [], ForgotPasswordController);
APIRouter.post(`/reset-password`, [], ResetPasswordController);
APIRouter.delete('/user', [AuthMiddleware], DeleteUserController);
APIRouter.get('/ping', [AuthMiddleware], PingController);

// Administration
APIRouter.delete('/database', [AuthMiddleware], FlushDatabaseController);
APIRouter.delete('/server', [AuthMiddleware], StopServerController);
APIRouter.get('/users', [AuthMiddleware], GetUsersController);

// Tokens
APIRouter.put('/token', [], ValidateTokenController);

// Secret
APIRouter.post('/secret', [AuthMiddleware], GetSecretController);



export default APIRouter;