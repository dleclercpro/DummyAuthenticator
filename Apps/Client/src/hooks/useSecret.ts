import { useState } from 'react';
import { CallGetSecret } from '../models/calls/user/CallGetSecret';

const useSecret = () => {    
    const [secret, setSecret] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSecret = async () => {
        setError('');
        setLoading(true);

        try {
            const { data } = await new CallGetSecret().execute();
            
            if (!data) {
                throw new Error('MISSING_SECRET');
            }

            setSecret(data);

        } catch (err: any) {
            setError('Impossible to fetch user secret.');
            setSecret('?');

            throw err;
        
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        secret,
        fetchSecret,
    };
}

export default useSecret;