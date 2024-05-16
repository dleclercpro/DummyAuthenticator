import { useState } from 'react';
import * as CallDeleteUser from '../models/calls/user/CallDeleteUser';
import * as CallFlushDatabase from '../models/calls/admin/CallFlushDatabase';
import * as CallGetUsers from '../models/calls/user/CallGetUsers';
import { translateServerError } from '../errors/ServerErrors';

const useDatabase = () => {    
    const [isFlushing, setIsFlushing] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [users, setUsers] = useState<string[]>([]);
    const [admins, setAdmins] = useState<string[]>([]);

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

        return await new CallDeleteUser.default().execute({ email })
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsDeletingUser(false);
            });
    };

    const getUsers = async () => {
        return await new CallGetUsers.default()
            .execute()
            .then(({ data }) => {
                const { users, admins } = data as CallGetUsers.ResponseData;

                setUsers(users);
                setAdmins(admins);
            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            });
    }

    return {
        isFlushing,
        isDeletingUser,
        users,
        admins,
        flush,
        deleteUser,
        getUsers,
    };
}

export default useDatabase;