import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import router from './routes';
import { ENV, PORT, ROOT } from './config/AppConfig';
import UserDatabase from './databases/UserDatabase';
import SessionDatabase from './databases/SessionDatabase';



/* -------------------------------------------------- INSTANCES -------------------------------------------------- */
// Server
const server = express();

// Databases
const users = UserDatabase.get();
const sessions = SessionDatabase.get();



/* -------------------------------------------------- OPTIONS -------------------------------------------------- */
// Trust first-level proxy
server.set('trust proxy', 1);



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

    // Listen to new users added to database
    users.onSet(({ value: user }) => {
        console.log(`Added new user: ${user.stringify()}`);
    });

    // Listen to users removed from database
    users.onDelete(({ prevValue: user }) => {
        console.log(`Removed user: ${user.stringify()}`);
    });

    // Listen to new user sessions
    sessions.onSet(({ value: session }) => {
        console.log(`Created new session for user: ${session.getEmail()}`);
    });

    // Listen to end of user sessions
    sessions.onDelete(({ prevValue: session }) => {
        console.log(`Deleted session for user: ${session.getEmail()}`);
    });

    // Then start listening on given port
    server.listen(PORT, () => {
        console.info(`Server listening in ${ENV} mode at: ${ROOT}`);
    });
}



// Run
main().catch((err) => {
    console.error(err);
});