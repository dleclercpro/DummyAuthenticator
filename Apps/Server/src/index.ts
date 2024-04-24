import { ENV } from './config/AppConfig'; // Do NOT remove!
import AppServer from './models/AppServer';
import { logger } from './utils/logger';
import RedisDatabase from './models/databases/RedisDatabase';
import { MemoryDatabase } from './models/databases/MemoryDatabase';
import { DB_IN_MEMORY, DB_HOST, DB_PORT, DB_NAME } from './config/DatabasesConfig';
import Router from './routes';



export const APP_SERVER = new AppServer();
export const APP_DB = (DB_IN_MEMORY ?
    new MemoryDatabase<string>() :
    new RedisDatabase({
        host: DB_HOST,
        port: DB_PORT,
        name: DB_NAME,
    })
);



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_DB.start();

    await APP_SERVER.setup(Router);
    await APP_SERVER.start();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;