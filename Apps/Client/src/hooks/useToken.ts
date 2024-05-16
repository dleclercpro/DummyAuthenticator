import { useState } from 'react';
import * as CallValidateToken from '../models/calls/auth/CallValidateToken';
import { translateServerError } from '../errors/ServerErrors';
import { Token } from '../types/TokenTypes';

const useToken = <T extends Token> (value: string) => {    
    const [isValidated, setIsValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [unvalidatedValue, setUnvalidatedValue] = useState(value);
    const [validatedValue, setValidatedValue] = useState('');

    const [token, setToken] = useState<T | null>(null);


    
    const validate = async () => {
        setIsValidated(false);
        setIsLoading(true);

        setUnvalidatedValue(unvalidatedValue);
        setValidatedValue('');
        setToken(null);

        return new CallValidateToken.default().execute({ token: value })
            .then(({ data }) => {
                setValidatedValue((data as CallValidateToken.ResponseData).string);
                setToken(data as T);
            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            })
            .finally(() => {
                setIsLoading(false);
                setIsValidated(true);
            });
    };

    return {
        isValidated,
        isLoading,
        unvalidatedValue,
        validatedValue,
        token,
        error,
        validate,
    };
}

export default useToken;