import { useState } from 'react';
import * as CallValidateToken from '../models/calls/auth/CallValidateToken';
import { translateServerError } from '../errors/ServerErrors';

type Token<TokenContent> = { string: string, content: TokenContent };

const useToken = <TokenContent> (value: string) => {    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [unvalidatedValue, setUnvalidatedValue] = useState(value);
    const [validatedValue, setValidatedValue] = useState('');

    const [token, setToken] = useState<Token<TokenContent> | null>(null);


    
    const validate = async () => {
        setIsLoading(true);

        setUnvalidatedValue(unvalidatedValue);
        setValidatedValue('');
        setToken(null);

        new CallValidateToken.default().execute({ token: value })
            .then(({ data }) => {
                setValidatedValue(data!.string);
                setToken(data as Token<TokenContent>);
            })
            .catch(({ code, error, data }) => {
                const err = translateServerError(error);

                setError(err);

                throw new Error(err);
            });

        setIsLoading(false);
    };

    return {
        isLoading,
        unvalidatedValue,
        validatedValue,
        token,
        error,
        validate,
    };
}

export default useToken;