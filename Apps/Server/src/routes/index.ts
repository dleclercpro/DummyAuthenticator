import express, { Router } from 'express';
import { RequestMiddleware } from '../middleware/RequestMiddleware';
import { DEV, PROD, CLIENT_DIR, CLIENT_ROOT, TEST } from '../config/AppConfig';
import APIRouter from './APIRouter';
import { logger } from '../utils/logger';
import path from 'path';



const router = Router();



// MIDDLEWARE
router.use(RequestMiddleware);



// ROUTES

// API
router.use(`/api`, APIRouter);



// Prod: serve React app as static files on production environment
if (PROD) {
    router.use(express.static(path.join(CLIENT_DIR)));

    // Define a default route that serves the React app
    router.get('*', (req, res) => {
        const url = path.join(CLIENT_DIR, 'index.html');

        logger.trace(`Serving client app from: ${url}`);

        return res.sendFile(url);
    });
}

// Dev: redirect React app's traffic to development server
if (DEV || TEST) {
    router.get('*', (req, res) => {
        const path = req.originalUrl;
        const url = `${CLIENT_ROOT}${path}`;

        logger.trace(`Redirecting request to: ${url}`);

        return res.redirect(url);
    });
}



export default router;