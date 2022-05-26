import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/App';
import { getURL, Page } from '../routes/Router';
import useUser from './useUser';

const usePing = () => {
    const navigate = useNavigate();

    const { setIsLogged } = useContext(AuthContext);
    const { getUser } = useUser();

    useEffect(() => {
        getUser()
            .then(() => {
                setIsLogged(true);

                // Redirect home once logged in
                navigate(getURL(Page.Home));
            })
            .catch(() => {
                setIsLogged(false);
            });

    // eslint-disable-next-line 
    }, []);
}

export default usePing;