import { useState } from 'react';
import * as CallFlushDatabase from '../models/calls/admin/CallFlushDatabase';
import { translateServerError } from '../errors/ServerErrors';

const useDatabase = () => {    
    const [isFlushing, setIsFlushing] = useState(false);

    const flush = async () => {
        setIsFlushing(true);

        return await new CallFlushDatabase.default().execute()
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsFlushing(false);
            });
    };

    return {
        isFlushing,
        flush,
    };
}

export default useDatabase;