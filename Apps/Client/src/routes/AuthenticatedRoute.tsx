import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getURL, Page } from './Router';

interface Props {
    children: ReactElement,
    shouldBeAdmin?: boolean,
}

const AuthenticatedRoute: React.FC<Props> = (props) => {
    const { children, shouldBeAdmin } = props;

    const { ping, isLogged, isAdmin } = useAuth();
    const location = useLocation();

    if (!ping.isDone) {
        return null;
    }

    if (!isLogged || (shouldBeAdmin && !isAdmin)) {
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