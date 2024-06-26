import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { getURL, Page } from './Router';

interface Props {
    children: ReactElement,
}

const UnauthenticatedRoute: React.FC<Props> = (props) => {
    const { children } = props;

    const { ping, isLogged } = useAuthContext();
    const location = useLocation();

    if (!ping.isDone) {
        return null;
    }

    if (isLogged) {
        return (
            <Navigate
                to={getURL(Page.Home)}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

export default UnauthenticatedRoute;