import { ReactElement, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/App';
import { getURL, Page } from './Router';

interface Props {
    children: ReactElement,
}

const AuthenticatedRoute: React.FC<Props> = (props) => {
    const { children } = props;

    const { isLogged } = useContext(AuthContext);
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