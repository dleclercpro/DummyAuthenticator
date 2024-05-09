import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useHomePageStyles from './HomePageStyles';
import Snackbar from '../../Snackbar';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import PasswordIcon from '@mui/icons-material/Key';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import useSecret from '../../../hooks/useSecret';
import Spinner from '../../Spinner';
import LoadingButton from '../../buttons/LoadingButton';
import YesNoDialog from '../../dialogs/YesNoDialog';

interface Props {

}

const HomePage: React.FC<Props> = () => {
    const { classes } = useHomePageStyles();

    const { userEmail, isAdmin, signOut } = useAuth();
    const secret = useSecret();
    
    const navigate = useNavigate();

    const [isSigningOut, setIsSigningOut] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isSignOutConfirmDialogOpen, setIsSignOutConfirmDialogOpen] = useState(false);
    const openSignOutConfirmDialog = () => setIsSignOutConfirmDialogOpen(true);
    const closeSignOutConfirmDialog = () => setIsSignOutConfirmDialogOpen(false);

    // Redirect admin
    useEffect(() => {
        if (isAdmin) {
            navigate(getURL(Page.Admin));
        }
    }, []);

    // Fetch secret on load
    useEffect(() => {
        secret.fetch();
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

        await secret.fetch(true);
    }

    const handleSignOut = async () => {
        setSnackbarOpen(false);

        setIsSigningOut(true);

        return signOut()
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
        <>
            <YesNoDialog
                open={isSignOutConfirmDialogOpen}
                title='Sign out'
                text='Are you sure you want to sign out? You will be redirected to the home page.'
                handleYes={handleSignOut}
                handleNo={closeSignOutConfirmDialog}
                handleClose={closeSignOutConfirmDialog}
            />

            <Paper elevation={8} className={classes.root}>
                <Typography variant='h1' className={classes.title}>
                    Home
                </Typography>

                <Typography className={classes.text}>
                    Hello, <strong>[{userEmail}]</strong>. Here is your secret:
                </Typography>

                <Typography className={classes.secret}>
                    {secret.value}
                </Typography>

                <div className={classes.buttons}>
                    <LoadingButton
                        className={classes.button}
                        variant='outlined'
                        color='secondary'
                        icon={<RefreshIcon />}
                        loading={secret.isLoading}
                        onClick={handleRenewSecret}
                    >
                        Renew secret
                    </LoadingButton>

                    <Button
                        className={classes.button}
                        variant='contained'
                        component={Link}
                        to={getURL(Page.ResetPassword)}
                        color='secondary'
                        startIcon={<PasswordIcon />}
                    >
                        Reset password
                    </Button>
                    
                    <LoadingButton
                        className={classes.button}
                        icon={<LogoutIcon />}
                        loading={isSigningOut}
                        onClick={openSignOutConfirmDialog}
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
        </>
    );
}

export default HomePage;