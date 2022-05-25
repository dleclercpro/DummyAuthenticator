import { useState } from 'react';
import { CallSignUp } from '../calls/auth/CallSignUp';

const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetError = () => setError('');

    const signUp = async (email: string, password: string) => {
        setError('');
        setLoading(true);

        try {
            await new CallSignUp().execute({ email, password });
            
        } catch (err: any) {
            setError('Could not sign up.');

            throw err;
        
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