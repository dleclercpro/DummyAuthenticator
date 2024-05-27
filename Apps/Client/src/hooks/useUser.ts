import { useState } from 'react';
import * as CallEditUser from '../models/calls/user/CallEditUser';
import * as CallDeleteUser from '../models/calls/user/CallDeleteUser';
import { translateServerError } from '../errors/ServerErrors';
import { UserType } from '../constants';

const useUser = () => {    
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [error, setError] = useState('');

    const banUser = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, ban: true })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const unbanUser = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, ban: false })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const addUserToFavorites = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, favorite: true })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const removeUserFromFavorites = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, favorite: false })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const infirmUserEmail = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, confirm: false })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const confirmUserEmail = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, confirm: true })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const demoteUserToRegular = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, type: UserType.Regular })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
            });
    };

    const promoteUserToAdmin = async (email: string) => {
        setIsEditingUser(true);

        return new CallEditUser.default().execute({ email, type: UserType.Admin })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsEditingUser(false);
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

    return {
        error,
        isEditingUser,
        isDeletingUser,
        demoteUserToRegular,
        promoteUserToAdmin,
        infirmUserEmail,
        confirmUserEmail,
        banUser,
        unbanUser,
        addUserToFavorites,
        removeUserFromFavorites,
        deleteUser,
    };
}

export default useUser;