import { useState } from 'react';
import { CallSignIn } from '../calls/auth/CallSignIn';

const useSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetError = () => setError('');

    const signIn = async (email: string, password: string, staySignedIn: boolean) => {
        setError('');
        setLoading(true);

        try {
            await new CallSignIn().execute({ email, password, staySignedIn });
            
        } catch (err: any) {
            setError('Invalid credentials.');
        
            throw err;

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