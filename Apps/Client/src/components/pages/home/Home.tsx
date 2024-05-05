import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useHomeStyles from './HomeStyles';
import Snackbar from '../../Snackbar';
import LoadingButton from '../../buttons/LoadingButton';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import useSecret from '../../../hooks/useSecret';
import Spinner from '../../Spinner';

interface Props {

}

const Home: React.FC<Props> = () => {
    const { classes } = useHomeStyles();

    const { signOut } = useAuth();
    const navigate = useNavigate();

    const { loading, error, secret, fetchSecret } = useSecret();

    const [isSigningOut, setIsSigningOut] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch secret on load
    useEffect(() => {
        fetchSecret();
    }, []);

    // Update snackbar on new error
    useEffect(() => {
        if (error !== '') {
            setSnackbarMessage(error);
            setSnackbarOpen(true);
        }
    }, [error]);

    const handleRenewSecret = async () => {
        setSnackbarOpen(false);

        await fetchSecret();
    }

    const handleSignOut = async () => {
        setSnackbarOpen(false);

        setIsSigningOut(true);

        return signOut()
            .then(() => {

            })
            .catch(() => {
                
            })
            .finally(() => {
                setIsSigningOut(false);
                navigate(getURL(Page.SignIn));
            });
    }

    // No secret yet: wait
    if (!secret) {
        return (
            <Spinner size='large' />
        );
    }

    return (
        <Paper elevation={8} className={classes.root}>
            <Typography variant='h1' className={classes.title}>
                Home
            </Typography>
            
            <Typography className={classes.text}>
                You are logged in. Here is your secret:
            </Typography>

            <Typography className={classes.secret}>
                {loading ? '...' : secret}
            </Typography>

            <div className={classes.buttons}>
                <LoadingButton
                    className={classes.button}
                    variant='outlined'
                    color='secondary'
                    icon={<RefreshIcon />}
                    loading={loading}
                    onClick={handleRenewSecret}
                >
                    Renew secret
                </LoadingButton>
                
                <LoadingButton
                    className={classes.button}
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

export default Home;