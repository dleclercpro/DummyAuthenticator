import { createContext, ReactElement, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CallSignIn } from '../calls/auth/CallSignIn';
import { CallSignOut } from '../calls/auth/CallSignOut';
import { CallPing } from '../calls/user/CallPing';
import { getURL, Page } from '../routes/Router';

interface IAuthContext {
    isPinged: boolean, // Determine whether user still has active session on server
    isLogged: boolean,
    ping: () => Promise<void>,
    login: (email: string, password: string, staySignedIn: boolean) => Promise<void>,
    logout: () => Promise<void>,
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

    const navigate = useNavigate();

    const ping = async () => {
        try {
            await new CallPing().execute();
            setIsLogged(true)
            navigate(getURL(Page.Home));
        
        } catch (err: any) {
            setIsLogged(false);
            navigate(getURL(Page.SignIn));
        
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

    return {
        isPinged,
        isLogged,
        ping,
        login,
        logout,
    };
}