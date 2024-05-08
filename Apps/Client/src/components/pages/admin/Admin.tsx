import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAdminStyles from './AdminStyles';
import Snackbar from '../../Snackbar';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import PasswordIcon from '@mui/icons-material/Key';
import DatabaseIcon from '@mui/icons-material/Storage';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import useSecret from '../../../hooks/useSecret';
import Spinner from '../../Spinner';
import LoadingButton from '../../buttons/LoadingButton';
import useDatabase from '../../../hooks/useDatabase';

interface Props {

}

const Admin: React.FC<Props> = () => {
    const { classes } = useAdminStyles();

    const { setIsLogged, signOut } = useAuth();

    const secret = useSecret();
    const db = useDatabase();

    const [isSigningOut, setIsSigningOut] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch secret on load
    useEffect(() => {
        secret.renew();
    }, []);

    // Update snackbar on new error
    useEffect(() => {
        if (secret.error !== '') {
            setSnackbarMessage(secret.error);
            setSnackbarOpen(true);
        }
    }, [secret.error]);

    const handleRenewSecret = async () => {
        setSnackbarOpen(false);

        await secret.renew();
    }

    const handleFlushDatabase = async () => {
        setSnackbarOpen(false);

        return db.flush()
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setIsLogged(false);
            });
    }

    const handleSignOut = async () => {
        setSnackbarOpen(false);
        setIsSigningOut(true);

        return signOut()
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setIsSigningOut(false);
            });
    }

    // No secret yet: wait
    if (!secret.value) {
        return (
            <Spinner size='large' />
        );
    }

    return (
        <Paper elevation={8} className={classes.root}>
            <Typography variant='h1' className={classes.title}>
                Administration
            </Typography>
            
            <Typography className={classes.text}>
                You are logged in as an administrator. Here is your secret:
            </Typography>

            <Typography className={classes.secret}>
                {secret.value}
            </Typography>

            <div className={classes.buttons}>
                <LoadingButton
                    className={classes.button}
                    variant='contained'
                    color='primary'
                    icon={<RefreshIcon />}
                    loading={secret.isLoading}
                    onClick={handleRenewSecret}
                >
                    Renew secret
                </LoadingButton>

                <Button
                    className={classes.button}
                    variant='contained'
                    color='primary'
                    component={Link}
                    to={getURL(Page.ResetPassword)}
                    startIcon={<PasswordIcon />}
                >
                    Reset password
                </Button>

                <LoadingButton
                    className={classes.button}
                    variant='contained'
                    color='primary'
                    icon={<DatabaseIcon />}
                    loading={db.isFlushing}
                    onClick={handleFlushDatabase}
                >
                    Flush database
                </LoadingButton>
                
                <LoadingButton
                    className={classes.button}
                    variant='outlined'
                    color='secondary'
                    icon={<LogoutIcon />}
                    loading={isSigningOut}
                    onClick={handleSignOut}
                >
                    Sign out
                </LoadingButton>
            </div>

            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={Severity.Error}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default Admin;