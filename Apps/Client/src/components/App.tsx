import React, { useEffect, useState } from 'react';
import useAppStyles from './AppStyles';
import Router from '../routes/Router';
import { Container } from '@mui/system';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';
import ErrorIcon from '@mui/icons-material/WarningSharp';
import { SERVER_RETRY_CONN_MAX_ATTEMPTS, VERSION } from '../config/Config';
import { getExponentialBackoff } from '../utils/time';

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();

    const { ping } = useAuth();

    const [connectionAttempts, setConnectionAttempts] = useState(0);

    // Try connecting to server until a response is received
    useEffect(() => {
        const tryConnection = async (attempts: number) => {
            if (ping.isOnline) {
                return;
            }

            if (attempts > SERVER_RETRY_CONN_MAX_ATTEMPTS) {
                console.error(`Impossible to connect to server!`);
                return;
            }

            await ping.execute();

            setTimeout(() => {
                setConnectionAttempts(attempts + 1);
    
            }, getExponentialBackoff(attempts).toMs().getAmount());
        };

        tryConnection(connectionAttempts);

    }, [connectionAttempts]);



    if (ping.isLoading) {
        return (
            <div className={classes.container}>
                {ping.isLoading && (
                    <Spinner size='large' />
                )}
            </div>
        );
    }

    if (ping.isDone && ping.error && connectionAttempts > SERVER_RETRY_CONN_MAX_ATTEMPTS) {
        return (
            <div className={classes.container}>
                <ErrorIcon color='error' className={classes.icon} />
                <p>Ping unsuccessful: <strong>{ping.error}</strong></p>
            </div>
        );
    }
    
    return (
        <Container className={classes.root} maxWidth='lg'>
            <Router />
            <div className={classes.status}>
                <strong className={classes.statusIcon}>{ping.isOnline ? '🟢' : '🔴'}</strong>
                <p className={classes.version}>{VERSION}</p>
            </div>
        </Container>
    );
}

export default App;