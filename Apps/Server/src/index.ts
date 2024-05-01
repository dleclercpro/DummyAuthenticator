import { ENV } from './config/AppConfig'; // Do NOT remove!
import AppServer from './models/AppServer';
import { logger } from './utils/logger';
import RedisDatabase from './models/databases/RedisDatabase';
import MemoryDatabase from './models/databases/MemoryDatabase';
import { REDIS_USE, REDIS_OPTIONS } from './config/DatabasesConfig';
import Router from './routes';



export const APP_SERVER = new AppServer();
export const APP_DB = (REDIS_USE ?
    new RedisDatabase(REDIS_OPTIONS) :
    new MemoryDatabase<string>() // Fallback database: in-memory
);



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_DB.start();

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