import { ENV } from './config/AppConfig'; // Do NOT remove!
import process from 'process';
import router from './routes';
import AppServer from './models/AppServer';
import { killAfterTimeout } from './utils/process';
import { logger } from './utils/logger';
import { TimeUnit } from './types/TimeTypes';
import RedisDatabase from './models/databases/RedisDatabase';
import { MemoryDatabase } from './models/databases/MemoryDatabase';
import TimeDuration from './models/units/TimeDuration';
import { DB_IN_MEMORY, DB_HOST, DB_PORT, DB_NAME } from './config/DatabasesConfig';



export const SERVER = new AppServer();
export const DB = (DB_IN_MEMORY ?
    new MemoryDatabase<string>() :
    new RedisDatabase({
        host: DB_HOST,
        port: DB_PORT,
        name: DB_NAME,
    })
);



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await DB.start();

    await SERVER.setup(router);
    await SERVER.start();
}



// Shut down gracefully
const TIMEOUT = new TimeDuration(2, TimeUnit.Second);

const stopServer = async () => {
    await SERVER.stop();

    await DB.stop();

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