import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CallSignOut } from '../calls/auth/CallSignOut';
import { AuthContext } from '../components/App';
import { getURL, Page } from '../routes/Router';

const useSignOut = () => {
    const { setIsLogged } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const signOut = async () => {
        setError('');
        setLoading(true);

        try {
            await new CallSignOut().execute();
            
        } catch (err: any) {
            setError('Could not sign out.');
        
        } finally {
            setLoading(false);
            setIsLogged(false);
            navigate(getURL(Page.SignIn));
        }
    };

    return {
        loading,
        error,
        signOut,
    };
}

export default useSignOut;