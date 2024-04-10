import { createContext, ReactElement, useContext, useState } from 'react';
import { CallSignIn } from '../calls/auth/CallSignIn';
import { CallSignOut } from '../calls/auth/CallSignOut';
import { CallPing } from '../calls/user/CallPing';
import { CallResetPassword } from '../calls/auth/CallResetPassword';
import { CallForgotPassword } from '../calls/auth/CallForgotPassword';

interface IAuthContext {
    isPinged: boolean, // Determine whether user still has active session on server
    isLogged: boolean,
    ping: () => Promise<void>,
    login: (email: string, password: string, staySignedIn: boolean) => Promise<void>,
    logout: () => Promise<void>,
    forgotPassword: (email: string) => Promise<void>,
    resetPassword: (token: string, password: string) => Promise<void>,
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
    const [isPinged, setIsPinged] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const ping = async () => {
        try {
            await new CallPing().execute();
            setIsLogged(true);
        
        } catch (err: any) {
            setIsLogged(false);
        
        } finally {
            setIsPinged(true);
        }
    }

    const login = async (email: string, password: string, staySignedIn: boolean) => {
        await new CallSignIn().execute({ email, password, staySignedIn });

        setIsLogged(true);
    }

    const logout = async () => {
        await new CallSignOut().execute();
        
        setIsLogged(false);
    }

    const forgotPassword = async (email: string) => {
        await new CallForgotPassword().execute({ email });
    }

    const resetPassword = async (token: string, password: string) => {
        await new CallResetPassword(token).execute({ password });
    }

    return {
        isPinged,
        isLogged,
        ping,
        login,
        logout,
        forgotPassword,
        resetPassword,
    };
}