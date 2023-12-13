import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import router from './routes';
import { ENV, PORT, ROOT } from './config/AppConfig';
import { logger } from './utils/Logging';



/* -------------------------------------------------- INSTANCES -------------------------------------------------- */
// Server
const server = express();



/* -------------------------------------------------- MIDDLEWARE -------------------------------------------------- */

// Cookies
server.use(cookieParser());

// JSON
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// GZIP
server.use(compression());

// API
server.use('/', router);



/* -------------------------------------------------- MAIN -------------------------------------------------- */
const main = async () => {

    // Then start listening on given port
    server.listen(PORT, () => {
        logger.info(`Server listening in ${ENV} mode at: ${ROOT}`);
    });
}



// Run
main().catch((err) => {
    logger.error(err);
});