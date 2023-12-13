import express, { Router } from 'express';
import { RequestMiddleware } from '../middleware/RequestMiddleware';
import { CLIENT_DIRECTORY, CLIENT_ROOT, PROD } from '../config/AppConfig';
import ApiRouter from './api';



const router = Router();



// MIDDLEWARE
router.use(RequestMiddleware);



// ROUTES

// API
router.use(`/api`, ApiRouter);

// Client app
if (PROD) {
    router.use('/', express.static(CLIENT_DIRECTORY));
} else {
    router.use('/', (req, res, next) => {
        const path = req.originalUrl;
        const url = `${CLIENT_ROOT}${path}`;

        return res.redirect(url);
    });
}



export default router;