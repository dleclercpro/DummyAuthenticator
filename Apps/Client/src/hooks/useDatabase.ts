import { useState } from 'react';
import * as CallDeleteUser from '../models/calls/user/CallDeleteUser';
import * as CallFlushDatabase from '../models/calls/admin/CallFlushDatabase';
import { translateServerError } from '../errors/ServerErrors';

const useDatabase = () => {    
    const [isFlushing, setIsFlushing] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);

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

    const deleteUser = async (email: string) => {
        setIsDeletingUser(true);

        return await new CallDeleteUser.default().execute()
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsDeletingUser(false);
            });
    };

    return {
        isFlushing,
        isDeletingUser,
        flush,
        deleteUser,
    };
}

export default useDatabase;