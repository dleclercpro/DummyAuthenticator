import http from 'http';
import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { logger } from '../utils/logger';
import { ROOT, PORT, CLIENT_ROOT, DEV } from '../config/AppConfig';
import ErrorMiddleware from '../middleware/ErrorMiddleware';

class AppServer {
    protected app?: express.Express;
    protected server?: http.Server;

    public async setup(router: Router) {
        this.app = express();
        this.server = http.createServer(this.app);
    
        // Enable use of cookies
        this.app.use(cookieParser());
    
        // Enable use of JSON data
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    
        // Enable HTTP response compression
        this.app.use(compression());

        // Allow all origins in dev mode
        if (DEV) {
            logger.debug(`Enabling CORS in development environment...`);

            const CORS_OPTIONS = {
                origin: CLIENT_ROOT,
                credentials: true,
            };

            this.app.use(cors(CORS_OPTIONS));
        }

        // Define server's API endpoints
        this.app.use('/', router);

        // Final error middleware
        this.app.use(ErrorMiddleware);
    }

    public getApp() {
        return this.app;
    }

    public getServer() {
        return this.server;
    }

    public async start() {
        if (!this.server) throw new Error('MISSING_SERVER');

        this.server.listen(PORT, async () => {
            logger.debug(`App server listening at: ${ROOT}`);
        });
    }

    public async stop() {
        if (!this.server) throw new Error('MISSING_SERVER');

        return new Promise<void>((resolve, reject) => {
            this.server!.close((err) => {
                if (err) {
                    logger.fatal(`Could not shut down server gracefully: ${err}`);
                    reject(err);
                }

                logger.info(`Server shut down gracefully.`);
                resolve();
            });
        });
    }
}

export default AppServer;