import { useState } from 'react';
import * as CallEditUser from '../models/calls/user/CallEditUser';
import * as CallUnconfirmUserEmail from '../models/calls/auth/CallUnconfirmEmail';
import { translateServerError } from '../errors/ServerErrors';
import { UserType } from '../constants';

const useUser = () => {    
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [isUnconfirmingUserEmail, setIsUnconfirmingUserEmail] = useState(false);
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

    const unconfirmUserEmail = async (email: string) => {
        setIsUnconfirmingUserEmail(true);

        return new CallUnconfirmUserEmail.default().execute({ email })
            .then(({ data }) => {

            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsUnconfirmingUserEmail(false);
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

    return {
        error,
        isEditingUser,
        isUnconfirmingUserEmail,
        demoteUserToRegular,
        promoteUserToAdmin,
        unconfirmUserEmail,
        banUser,
        unbanUser,
    };
}

export default useUser;