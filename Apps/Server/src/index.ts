import { ENV } from './config/AppConfig'; // Do NOT remove!
import process from 'process';
import router from './routes';
import AppServer from './models/AppServer';
import { killAfterTimeout } from './libs/process';
import TimeDuration from './models/units/TimeDuration';
import { logger } from './utils/Logging';
import { TimeUnit } from './types/TimeTypes';



export const APP_SERVER = new AppServer();



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_SERVER.setup(router);
    await APP_SERVER.start();
}



// Shut down gracefully
const TIMEOUT = new TimeDuration(2, TimeUnit.Second);

const stopAppServer = async () => {
    await APP_SERVER.stop();
    process.exit(0);
};

const handleStopSignal = async (signal: string) => {
    logger.warn(`Received stop signal: ${signal}`);
    await Promise.race([stopAppServer(), killAfterTimeout(TIMEOUT)]);
}

process.on('SIGTERM', handleStopSignal);
process.on('SIGINT', handleStopSignal);



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;