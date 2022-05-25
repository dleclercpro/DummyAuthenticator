import { useState } from 'react';
import { CallSignOut } from '../calls/auth/CallSignOut';

const useSignOut = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const signOut = async () => {
        setError('');
        setLoading(true);

        try {
            await new CallSignOut().execute();
            
        } catch (err: any) {
            setError('Could not sign out.');
        
            throw err;

        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        signOut,
    };
}

export default useSignOut;