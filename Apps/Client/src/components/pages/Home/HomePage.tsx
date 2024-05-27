import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import Snackbar from '../../Snackbar';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import PasswordIcon from '@mui/icons-material/Key';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuthContext from '../../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import useSecret from '../../../hooks/useSecret';
import Spinner from '../../Spinner';
import LoadingButton from '../../buttons/LoadingButton';
import YesNoDialog from '../../dialogs/YesNoDialog';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import useHomePageStyles from './HomePageStyles';
import useUser from '../../../hooks/useUser';

interface Props {

}

const HomePage: React.FC<Props> = () => {
    const { classes } = useHomePageStyles();

    const { appUserEmail, isAdmin, isSuperAdmin, setIsLogged, signOut } = useAuthContext();
    const user = useUser(appUserEmail);
    const secret = useSecret();

    const navigate = useNavigate();

    const [isSigningOut, setIsSigningOut] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isSignOutConfirmDialogOpen, setIsSignOutConfirmDialogOpen] = useState(false);
    const openSignOutConfirmDialog = () => setIsSignOutConfirmDialogOpen(true);
    const closeSignOutConfirmDialog = () => setIsSignOutConfirmDialogOpen(false);

    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const openDeleteUserConfirmDialog = () => {
        setIsDeleteUserConfirmDialogOpen(true);
    }
    const closeDeleteUserConfirmDialog = () => {
        setIsDeleteUserConfirmDialogOpen(false);
    }

    // Redirect admin
    useEffect(() => {
        if (isAdmin || isSuperAdmin) {
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

    const handleDeleteUser = async () => {
        setIsDeleteUserConfirmDialogOpen(false);

        return user.delete()
            .finally(() => {
                setIsLogged(false);
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
            <YesNoDialog
                open={isDeleteUserConfirmDialogOpen}
                title='Delete account'
                text='Are you sure you want to delete your account? This cannot be undone! You will then be logged out and redirected to the home page.'
                handleYes={handleDeleteUser}
                handleNo={closeDeleteUserConfirmDialog}
                handleClose={closeDeleteUserConfirmDialog}
            />

            <Paper elevation={8} className={classes.root}>
                <Typography variant='h1' className={classes.title}>
                    Home
                </Typography>

                <Typography className={classes.text}>
                    Hello, <strong>[{appUserEmail}]</strong>. Here is your secret:
                </Typography>

                <Typography className={classes.secret}>
                    {secret.value}
                </Typography>

                <div className={classes.buttons}>
                    <LoadingButton
                        className={classes.button}
                        variant='contained'
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
                        startIcon={<PasswordIcon />}
                    >
                        Reset password
                    </Button>

                    <Button
                        className={classes.button}
                        variant='contained'
                        color='primary'
                        component={Link}
                        to={getURL(Page.Users)}
                        startIcon={<PeopleIcon />}
                    >
                        List users
                    </Button>

                    <Button
                        className={classes.button}
                        variant='contained'
                        color='primary'
                        component={Link}
                        to={getURL(Page.Search)}
                        startIcon={<SearchIcon />}
                    >
                        Search users
                    </Button>

                    <LoadingButton
                        className={classes.button}
                        variant='contained'
                        color='error'
                        icon={<DeleteIcon />}
                        loading={user.isDeleting}
                        disabled={isSuperAdmin}
                        onClick={openDeleteUserConfirmDialog}
                    >
                        Delete account
                    </LoadingButton>
                    
                    <LoadingButton
                        className={classes.button}
                        icon={<LogoutIcon />}
                        variant='contained'
                        color='secondary'
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