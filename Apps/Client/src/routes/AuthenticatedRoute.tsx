import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getURL, Page } from './Router';

interface Props {
    children: ReactElement,
}

const AuthenticatedRoute: React.FC<Props> = (props) => {
    const { children } = props;

    const { isLogged } = useAuth();
    const location = useLocation();

    if (!isLogged) {
        return (
            <Navigate
                to={getURL(Page.SignIn)}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

export default AuthenticatedRoute;