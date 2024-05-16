import { useState } from 'react';
import * as CallStopServer from '../models/calls/admin/CallStopServer';
import { translateServerError } from '../errors/ServerErrors';

const useServer = () => {    
    const [isStopping, setIsStopping] = useState(false);

    const stop = async () => {
        setIsStopping(true);

        return await new CallStopServer.default().execute()
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsStopping(false);
            });
    };

    return {
        isStopping,
        stop,
    };
}

export default useServer;