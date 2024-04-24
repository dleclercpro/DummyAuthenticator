import { useState } from 'react';
import { CallGetSecret } from '../models/calls/user/CallGetSecret';

const useSecret = () => {    
    const [secret, setSecret] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSecret = async () => {
        setLoading(true);

            await new CallGetSecret().execute()
                .then(({ data }) => {
                    setSecret(data as string);
                    setError('');
                })
                .catch(({ code, error, data }) => {
                    setSecret('?');
                    setError('Impossible to fetch user secret.');
                });

        setLoading(false);
    };

    return {
        loading,
        error,
        secret,
        fetchSecret,
    };
}

export default useSecret;