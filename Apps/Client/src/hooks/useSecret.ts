import { useState } from 'react';
import * as CallGetSecret from '../models/calls/user/CallGetSecret';

const useSecret = () => {    
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('...');
    const [error, setError] = useState('');

    const renew = async () => {
        setIsLoading(true);
        setValue('...');

        await new CallGetSecret.default()
            .execute()
            .then(({ data }) => {
                setValue(data as CallGetSecret.ResponseData);
                setError('');
            })
            .catch(({ code, error, data }) => {
                setValue('???');
                setError('Impossible to fetch user secret.');
            });

        setIsLoading(false);
    };

    return {
        isLoading,
        value,
        error,
        renew,
    };
}

export default useSecret;