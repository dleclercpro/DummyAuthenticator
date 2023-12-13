import express, { Router } from 'express';
import { RequestMiddleware } from '../middleware/RequestMiddleware';
import { CLIENT_ROOT, PROD } from '../config/AppConfig';
import ApiRouter from './api';
import { logger } from '../utils/logger';
import path from 'path';
import { CLIENT_DIR } from '../config/ResourceConfig';



const router = Router();



// MIDDLEWARE
router.use(RequestMiddleware);



// ROUTES

// API
router.use(`/api`, ApiRouter);

// Client app
if (PROD) {

    // Serve React app's static files
    router.use(express.static(path.join(CLIENT_DIR)));

    // Define a route that serves the React app
    router.get('*', (req, res) => {
        const url = path.join(CLIENT_DIR, 'index.html');

        logger.trace(`Serving client app from: ${url}`);

        return res.sendFile(url);
    });
} else {
    
    // Redirect app to React's development server
    router.get('*', (req, res, next) => {
        const path = req.originalUrl;
        const url = `${CLIENT_ROOT}${path}`;

        logger.trace(`Redirecting request to: ${url}`);

        return res.redirect(url);
    });
}



export default router;