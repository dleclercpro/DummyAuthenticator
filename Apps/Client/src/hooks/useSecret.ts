import { useState } from 'react';
import { CallGetSecret } from '../calls/user/CallGetSecret';

const useSecret = () => {    
    const [secret, setSecret] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSecret = async (renew: boolean = false) => {
        setError('');
        setLoading(true);

        try {
            setSecret(await new CallGetSecret().execute({ renew }));

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