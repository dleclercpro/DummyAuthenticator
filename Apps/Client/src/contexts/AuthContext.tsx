import { createContext, ReactElement, useContext, useState } from 'react';
import { ServerError, translateServerError } from '../errors/ServerErrors';
import * as CallSignIn from '../models/calls/auth/CallSignIn';
import * as CallSignOut from '../models/calls/auth/CallSignOut';
import * as CallPing from '../models/calls/auth/CallPing';
import * as CallResetPassword from '../models/calls/auth/CallResetPassword';
import * as CallForgotPassword from '../models/calls/auth/CallForgotPassword';
import * as CallConfirmEmail from '../models/calls/auth/CallConfirmEmail';
import * as CallSignUp from '../models/calls/auth/CallSignUp';

interface IPingContext {
    isLoading: boolean,
    isDone: boolean,
    isServerOnline: boolean,
    error: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    execute: () => Promise<React.SetStateAction<CallPing.ResponseData>>,
}

interface IAuthContext {
    ping: IPingContext,
    appUserEmail: string,
    isLogged: boolean,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    setIsLogged: (isLogged: boolean) => void,
    setIsAdmin: (isAdmin: boolean) => void,
    setIsSuperAdmin: (isAdmin: boolean) => void,
    signUp: (email: string, password: string) => Promise<void>,
    signIn: (email: string, password: string, staySignedIn: boolean) => Promise<{ email: string, isAdmin: boolean, isSuperAdmin: boolean }>,
    signOut: () => Promise<void>,
    confirmEmail: (token: string) => Promise<void>,
    forgotPassword: (email: string) => Promise<void>,
    resetPassword: (password: string, token?: string) => Promise<void>,
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);



interface Props {
    children: ReactElement,
}

export const AuthContextProvider: React.FC<Props> = (props) => {
    const { children } = props;

    const auth = useAuthContext();
    
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export default function AuthContextConsumer() {
    return useContext(AuthContext);
}



const useAuthContext = () => {
    const [appUserEmail, setUserEmail] = useState('');

    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const [isServerOnline, setIsServerOnline] = useState(false);

    const [pingIsLoading, setPingIsLoading] = useState(false);
    const [pingIsDone, setPingIsDone] = useState(false);
    const [pingError, setPingError] = useState('');

    const pingExecute = async () => {
        setPingIsDone(false);
        setPingIsLoading(true);

        try {
            const { data } = await new CallPing.default().execute();

            const user = (data as CallPing.ResponseData);

            setUserEmail(user.email);
            setIsAdmin(user.isAdmin);
            setIsSuperAdmin(user.isSuperAdmin);
            setIsLogged(true);
            setPingError('');

            setIsServerOnline(true);

            return user;
        } catch (err: any) {
            setIsLogged(false);
            setUserEmail('');
            setIsAdmin(false);
            setIsSuperAdmin(false);
            setPingError(err.message);

            setIsServerOnline(err.message !== 'NO_SERVER_CONNECTION');

            return { email: '', isAdmin: false, isSuperAdmin: false };
        } finally {
            setPingIsLoading(false);
            setPingIsDone(true);
        }
    }

    const ping = {
        isServerOnline,
        isLoading: pingIsLoading,
        isDone: pingIsDone,
        error: pingError,
        setIsLoading: setPingIsLoading,
        setIsDone: setPingIsDone,
        setError: setPingError,
        execute: pingExecute,
    };



    const signUp = async (email: string, password: string) => {
        await new CallSignUp.default()
            .execute({ email, password })
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            });
    }

    const signIn = async (email: string, password: string, staySignedIn: boolean) => {
        const { data } = await new CallSignIn.default()
            .execute({ email, password, staySignedIn })
            .catch(({ code, error, data }) => {
                if (error === ServerError.NoMoreLoginAttempts) {
                    const { attempts, maxAttempts } = data;

                    throw new Error(translateServerError(error)
                        .replace('{{ ATTEMPTS }}', attempts)
                        .replace('{{ MAX_ATTEMPTS }}', maxAttempts)
                    );
                }

                throw new Error(translateServerError(error));
            });

        const user = (data as CallSignIn.ResponseData);

        setUserEmail(user.email);
        setIsAdmin(user.isAdmin);
        setIsSuperAdmin(user.isSuperAdmin);
        setIsLogged(true);

        return user;
    }

    const signOut = async () => {
        await new CallSignOut.default()
            .execute()
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            })
            .finally(() => {
                setIsLogged(false);
                setIsAdmin(false);
                setIsSuperAdmin(false);
            });
    }

    const confirmEmail = async (token: string) => {
        await new CallConfirmEmail.default(token)
            .execute()
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            });
    }

    const forgotPassword = async (email: string) => {
        await new CallForgotPassword.default()
            .execute({ email })
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            });
    }

    const resetPassword = async (password: string, token?: string) => {

        // No need for token when logged in
        if (isLogged) {
            await new CallResetPassword.default()
                .execute({ password })
                .then(() => {

                })
                .catch(({ code, error, data }) => {
                    throw new Error(translateServerError(error));
                });

            return;
        }

        // Need token to reset password when logged out
        if (!token) {
            throw new Error('MISSING_TOKEN');
        }

        await new CallResetPassword.default(token)
            .execute({ password })
            .then(() => {

            })
            .catch(({ code, error, data }) => {
                throw new Error(translateServerError(error));
            });
    }

    return {
        ping,
        appUserEmail,
        isLogged,
        isAdmin,
        isSuperAdmin,
        setIsLogged,
        setIsAdmin,
        setIsSuperAdmin,
        signUp,
        signIn,
        signOut,
        confirmEmail,
        forgotPassword,
        resetPassword,
    };
}