import { useState } from 'react';
import { CallGetUser } from '../calls/user/CallGetUser';

const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState('');

    const getUser = async () => {
        setError('');
        setUser('');
        setLoading(true);

        try {
            const { email } = await new CallGetUser().execute();

            setUser(`Here is your e-mail: ${email}`);

        } catch (err: any) {
            setError('Impossible to fetch user info.');

            throw err;
        
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        user,
        getUser,
    };
}

export default useUser;