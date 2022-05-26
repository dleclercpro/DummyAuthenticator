import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CallSignUp } from '../calls/auth/CallSignUp';
import { getURL, Page } from '../routes/Router';

const useSignUp = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetError = () => setError('');

    const signUp = async (email: string, password: string) => {
        setError('');
        setLoading(true);

        try {
            await new CallSignUp().execute({ email, password });
            
            navigate(getURL(Page.SignIn));

        } catch (err: any) {
            setError('Could not sign up.');

        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        resetError,
        signUp,
    };
}

export default useSignUp;