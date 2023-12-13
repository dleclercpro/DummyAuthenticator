import { ENV } from './config/AppConfig'; // Do NOT remove!
import process from 'process';
import router from './routes';
import AppServer from './models/AppServer';
import { killAfterTimeout } from './utils/process';
import TimeDuration from './models/units/TimeDuration';
import { logger } from './utils/logger';
import { TimeUnit } from './types/TimeTypes';



export const SERVER = new AppServer();



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await SERVER.setup(router);
    await SERVER.start();
}



// Shut down gracefully
const TIMEOUT = new TimeDuration(2, TimeUnit.Second);

const stopServer = async () => {
    await SERVER.stop();
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