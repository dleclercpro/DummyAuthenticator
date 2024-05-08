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

    const { ping } = useAuth();

    // Try to connect to server on application start
    useEffect(() => {
        ping.execute();
    }, []);

    if (ping.isLoading || ping.error) {
        return (
            <div className={classes.container}>
                {ping.isLoading && (
                    <Spinner size='large' />
                )}
                {ping.isDone && ping.error && (
                    <>
                        <ErrorIcon color='error' className={classes.icon} />
                        <p>Could not ping server: <strong>{ping.error}</strong></p>
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