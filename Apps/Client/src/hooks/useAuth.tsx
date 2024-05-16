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
    isOnline: boolean,
    error: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    execute: () => Promise<React.SetStateAction<CallPing.ResponseData>>,
}

interface IAuthContext {
    ping: IPingContext,
    userEmail: string,
    isLogged: boolean,
    isAdmin: boolean,
    setIsLogged: (isLogged: boolean) => void,
    setIsAdmin: (isAdmin: boolean) => void,
    signUp: (email: string, password: string) => Promise<void>,
    signIn: (email: string, password: string, staySignedIn: boolean) => Promise<{ email: string, isAdmin: boolean }>,
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

    const auth = useAuth();
    
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export default function AuthContextConsumer() {
    return useContext(AuthContext);
}



const useAuth = () => {
    const [userEmail, setUserEmail] = useState('');

    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isServerOnline, setIsServerOnline] = useState(false);

    const [pingIsLoading, setPingIsLoading] = useState(false);
    const [pingIsDone, setPingIsDone] = useState(false);
    const [pingError, setPingError] = useState('');

    const pingExecute = async () => {
        setPingIsDone(false);
        setPingIsLoading(true);

        try {
            const { data } = await new CallPing.default().execute();

            setIsServerOnline(true);

            const user = (data as CallPing.ResponseData);

            setUserEmail(user.email);
            setIsAdmin(user.isAdmin);
            setIsLogged(true);

            setPingError('');

            return user;
        } catch (err: any) {
            setIsServerOnline(err.message !== 'NO_SERVER_CONNECTION');

            setIsLogged(false);
            setIsAdmin(false);

            setPingError(err.message);

            return { email: '', isAdmin: false };
        } finally {
            setPingIsLoading(false);
            setPingIsDone(true);
        }
    }

    const ping = {
        isLoading: pingIsLoading,
        isDone: pingIsDone,
        isOnline: isServerOnline,
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
        userEmail,
        isLogged,
        isAdmin,
        setIsLogged,
        setIsAdmin,
        signUp,
        signIn,
        signOut,
        confirmEmail,
        forgotPassword,
        resetPassword,
    };
}