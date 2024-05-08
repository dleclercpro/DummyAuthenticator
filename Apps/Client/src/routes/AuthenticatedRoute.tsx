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

    const { isPinged, isLogged, isAdmin } = useAuth();
    const location = useLocation();

    if (!isPinged) {
        return null;
    }

    if (!isLogged || (shouldBeAdmin && !isAdmin)) {
        console.log(`Redirecting to sign in page...`);
        console.log(`isLogged: ${isLogged}`);
        console.log(`isAdmin: ${isAdmin}`);

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