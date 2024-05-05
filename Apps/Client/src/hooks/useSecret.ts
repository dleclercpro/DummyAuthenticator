import { useState } from 'react';
import * as CallGetSecret from '../models/calls/user/CallGetSecret';

const useSecret = () => {    
    const [secret, setSecret] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSecret = async () => {
        setLoading(true);

        await new CallGetSecret.default()
            .execute()
            .then(({ data }) => {
                setSecret(data as CallGetSecret.ResponseData);
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