import React, { useEffect, useState } from 'react';
import useAppStyles from './AppStyles';
import Router from '../routes/Router';
import { Container } from '@mui/system';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';
import ErrorIcon from '@mui/icons-material/WarningSharp';
import { SERVER_RETRY_CONN_MAX_ATTEMPTS, VERSION } from '../config/Config';
import { getExponentialBackoff, sleep } from '../utils/time';
import { Typography } from '@mui/material';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();

    const { ping } = useAuth();

    const [attempts, setAttempts] = useState(0);
    const [backoff, setBackoff] = useState<TimeDuration>(new TimeDuration(0, TimeUnit.Second));
    const [isDone, setIsDone] = useState(false);

    // Try connecting to server until a response is received
    useEffect(() => {
        const tryConnection = async (attempts: number) => {
            if (ping.isOnline) {
                setIsDone(true);
                return;
            }
            if (attempts + 1 > SERVER_RETRY_CONN_MAX_ATTEMPTS) {
                console.error(`Impossible to connect to server!`);
                setIsDone(true);
                return;
            }
            if (attempts > 0) {
                await sleep(backoff);
            }
            
            await ping.execute();

            setBackoff(getExponentialBackoff(attempts));
            setAttempts(attempts + 1);
        };

        tryConnection(attempts);

    }, [attempts]);

    let currentStatus = `[${attempts + 1}/${SERVER_RETRY_CONN_MAX_ATTEMPTS}]`;
    if (!backoff.isZero()) {
        currentStatus = `Wait for ${backoff.format()}... ${currentStatus}`;
    }

    if (!isDone) {
        return (
            <div className={classes.spinnerContainer}>                    
                <Spinner className={classes.spinner} size='large' />
                {backoff && (
                    <Typography>
                        <strong>Trying to connect to server.</strong> {currentStatus}
                    </Typography>
                )}
            </div>
        );
    }

    if (isDone && ping.error) {
        return (
            <div className={classes.errorContainer}>
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