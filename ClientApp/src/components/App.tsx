import React, { useEffect } from 'react';
import useAppStyles from './AppStyles';
import Router from '../routes/Router';
import { Container } from '@mui/system';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();

    const { isPinged, ping } = useAuth();

    // Try to connect to server on application start
    useEffect(() => {
        ping();

    // eslint-disable-next-line
    }, []);

    if (!isPinged) {
        return (
            <Spinner size='large' />
        );
    }
    
    return (
        <Container className={classes.root} maxWidth='lg'>
            <Router />
        </Container>
    );
}

export default App;