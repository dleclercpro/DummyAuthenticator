import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CallSignIn } from '../calls/auth/CallSignIn';
import { AuthContext } from '../components/App';
import { getURL, Page } from '../routes/Router';

const useSignIn = () => {
    const { setIsLogged } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetError = () => setError('');

    const signIn = async (email: string, password: string, staySignedIn: boolean) => {
        setError('');
        setLoading(true);

        try {
            await new CallSignIn().execute({ email, password, staySignedIn });

            setIsLogged(true);
            
            navigate(getURL(Page.Home));

        } catch (err: any) {
            setError('Invalid credentials.');
        
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        resetError,
        signIn,
    };
}

export default useSignIn;