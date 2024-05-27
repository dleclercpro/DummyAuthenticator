import { useState } from 'react';
import * as CallFlushDatabase from '../models/calls/admin/CallFlushDatabase';
import * as CallStopDatabase from '../models/calls/admin/CallStopDatabase';
import * as CallGetUsers from '../models/calls/user/CallGetUsers';
import * as CallSearchUsers from '../models/calls/user/CallSearchUsers';
import { translateServerError } from '../errors/ServerErrors';
import { UserJSON } from '../types/JSONTypes';

const useDatabase = () => {    
    const [isStopping, setIsStopping] = useState(false);
    const [isFlushing, setIsFlushing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [users, setUsers] = useState<UserJSON[]>([]);

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

    const fetchUsers = async () => {
        setIsFetching(true);

        return await new CallGetUsers.default()
            .execute()
            .then(({ data }) => {
                const users = data as CallGetUsers.ResponseData;

                setUsers(users);
            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsFetching(false);
            });
    }

    const searchUsers = async (searchText: string) => {
        setIsSearching(true);

        return await new CallSearchUsers.default()
            .execute({ searchText })
            .then(({ data }) => {
                const users = data as CallSearchUsers.ResponseData;

                setUsers(users);
            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsSearching(false);
            });
    }

    return {
        isStopping,
        isFlushing,
        isFetching,
        isSearching,
        users,
        stop,
        flush,
        fetchUsers,
        setUsers,
        searchUsers,
    };
}

export default useDatabase;