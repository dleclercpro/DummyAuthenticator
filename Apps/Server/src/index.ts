import { ENV, PROD } from './config/AppConfig'; // Do NOT remove!
import process from 'process';
import router from './routes';
import AppServer from './models/AppServer';
import { killAfterTimeout } from './utils/process';
import TimeDuration from './models/units/TimeDuration';
import { logger } from './utils/logger';
import { TimeUnit } from './types/TimeTypes';
import RedisDatabase from './models/databases/RedisDatabase';
import { MemoryDatabase } from './models/databases/MemoryDatabase';
import { SESSION_DB_HOST, SESSION_DB_NAME, SESSION_DB_PORT, USER_DB_HOST, USER_DB_NAME, USER_DB_PORT } from './config/DatabasesConfig';



export const SERVER = new AppServer();
export const USER_DB = (!PROD ?
    new MemoryDatabase<string>() :
    new RedisDatabase({
        host: USER_DB_HOST,
        port: USER_DB_PORT,
        name: USER_DB_NAME,
    })
);
export const SESSION_DB = (!PROD ?
    new MemoryDatabase<string>() :
    new RedisDatabase({
        host: SESSION_DB_HOST,
        port: SESSION_DB_PORT,
        name: SESSION_DB_NAME,
    })
);



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await USER_DB.start();
    await SESSION_DB.start();

    await SERVER.setup(router);
    await SERVER.start();
}



// Shut down gracefully
const TIMEOUT = new TimeDuration(2, TimeUnit.Second);

const stopServer = async () => {
    await SERVER.stop();

    await SESSION_DB.stop();
    await USER_DB.stop();

    process.exit(0);
};

const handleStopSignal = async (signal: string) => {
    logger.warn(`Received stop signal: ${signal}`);
    await Promise.race([stopServer(), killAfterTimeout(TIMEOUT)]);
}

process.on('SIGTERM', handleStopSignal);
process.on('SIGINT', handleStopSignal);



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;