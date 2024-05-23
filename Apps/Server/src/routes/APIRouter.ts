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
import StopDatabaseController from '../controllers/StopDatabaseController';
import SearchUsersController from '../controllers/SearchUsersController';
import EditUserController from '../controllers/EditUserController';
import UnconfirmEmailController from '../controllers/UnconfirmEmailController';



const APIRouter = Router();



// ROUTES

// Authentication
APIRouter.post(`/sign-up`, [], SignUpController);
APIRouter.put(`/sign-in`, [], SignInController);
APIRouter.get(`/sign-out`, [AuthMiddleware], SignOutController);
APIRouter.put('/confirm-email', [], ConfirmEmailController);
APIRouter.put('/unconfirm-email', [AuthMiddleware], UnconfirmEmailController);
APIRouter.post(`/forgot-password`, [], ForgotPasswordController);
APIRouter.post(`/reset-password`, [], ResetPasswordController);
APIRouter.get('/ping', [AuthMiddleware], PingController);

// Administration
APIRouter.put('/server/stop', [AuthMiddleware], StopServerController);
APIRouter.put('/database/stop', [AuthMiddleware], StopDatabaseController);
APIRouter.delete('/database', [AuthMiddleware], FlushDatabaseController);
APIRouter.get('/users', [AuthMiddleware], GetUsersController);
APIRouter.put('/users', [AuthMiddleware], SearchUsersController);
APIRouter.post('/user', [AuthMiddleware], EditUserController);
APIRouter.delete('/user', [AuthMiddleware], DeleteUserController);

// Tokens
APIRouter.put('/token', [], ValidateTokenController);

// Secret
APIRouter.post('/secret', [AuthMiddleware], GetSecretController);



export default APIRouter;