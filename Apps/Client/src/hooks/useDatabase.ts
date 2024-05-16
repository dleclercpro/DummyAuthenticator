import { useState } from 'react';
import * as CallFlushDatabase from '../models/calls/admin/CallFlushDatabase';
import * as CallStopDatabase from '../models/calls/admin/CallStopDatabase';
import * as CallDeleteUser from '../models/calls/user/CallDeleteUser';
import * as CallGetUsers from '../models/calls/user/CallGetUsers';
import * as CallSearchUsers from '../models/calls/user/CallSearchUsers';
import { translateServerError } from '../errors/ServerErrors';

const useDatabase = () => {    
    const [isStopping, setIsStopping] = useState(false);
    const [isFlushing, setIsFlushing] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);

    const [users, setUsers] = useState<{ value: string, confirmed: boolean }[]>([]);
    const [admins, setAdmins] = useState<{ value: string, confirmed: boolean }[]>([]);

    const stop = async () => {
        setIsStopping(true);

        return await new CallStopDatabase.default().execute()
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsStopping(false);
            });
    };

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

    const searchUsers = async (searchText: string) => {
        return await new CallSearchUsers.default()
            .execute({ searchText })
            .then(({ data }) => {
                const { users, admins } = data as CallSearchUsers.ResponseData;

                setUsers(users);
                setAdmins(admins);
            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            });
    }

    return {
        isStopping,
        isFlushing,
        isDeletingUser,
        users,
        admins,
        stop,
        flush,
        deleteUser,
        getUsers,
        searchUsers,
    };
}

export default useDatabase;