import React, { useEffect } from 'react';
import useAppStyles from './AppStyles';
import Router from '../routes/Router';
import { Container } from '@mui/system';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';
import ErrorIcon from '@mui/icons-material/WarningSharp';

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();

    const { isPinging, errorPing, ping } = useAuth();
    const hasError = !!errorPing;

    // Try to connect to server on application start
    useEffect(() => {
        ping();

    // eslint-disable-next-line
    }, []);

    if (isPinging || hasError) {
        return (
            <div className={classes.container}>
                {isPinging && (
                    <Spinner size='large' />
                )}
                {!isPinging && hasError && (
                    <>
                        <ErrorIcon color='error' className={classes.icon} />
                        <p>Could not ping server: <strong>{errorPing}</strong></p>
                    </>
                )}
            </div>
        );
    }
    
    return (
        <Container className={classes.root} maxWidth='lg'>
            <Router />
        </Container>
    );
}

export default App;