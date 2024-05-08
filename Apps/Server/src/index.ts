import { ENV } from './config/AppConfig'; // Do NOT remove!
import AppServer from './models/AppServer';
import { logger } from './utils/logger';
import Router from './routes';
import AppDatabase from './models/AppDatabase';



export const APP_SERVER = new AppServer();
export const APP_DB = new AppDatabase();



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_DB.start();
    await APP_DB.setup();

    await APP_SERVER.setup(Router);
    await APP_SERVER.start();
}



// Run server
execute()
    .catch(async (err) => {
        logger.fatal(err, `Uncaught error:`);

        logger.info(`Shutting down server...`);
        await APP_SERVER.stop();

        logger.info(`Shutting down database...`);
        await APP_DB.stop();
    });



export default execute;