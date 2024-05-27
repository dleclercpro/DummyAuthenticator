import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import Snackbar from '../../Snackbar';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import PasswordIcon from '@mui/icons-material/Key';
import DatabaseIcon from '@mui/icons-material/Storage';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import StopServerIcon from '@mui/icons-material/Dangerous';
import useAuthContext from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import useSecret from '../../../hooks/useSecret';
import Spinner from '../../Spinner';
import LoadingButton from '../../buttons/LoadingButton';
import useDatabase from '../../../hooks/useDatabase';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useServer from '../../../hooks/useServer';
import useAdminPageStyles from './AdminPageStyles';
import useUser from '../../../hooks/useUser';

interface Props {

}

const AdminPage: React.FC<Props> = () => {
    const { classes } = useAdminPageStyles();

    const { isSuperAdmin, userEmail, setIsLogged, signOut } = useAuthContext();

    const { isDeletingUser, deleteUser } = useUser();

    const secret = useSecret();
    const server = useServer();
    const db = useDatabase();

    const [isSigningOut, setIsSigningOut] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isFlushDatabaseConfirmDialogOpen, setIsFlushDatabaseConfirmDialogOpen] = useState(false);
    const openFlushDatabaseConfirmDialog = () => setIsFlushDatabaseConfirmDialogOpen(true);
    const closeFlushDatabaseConfirmDialog = () => setIsFlushDatabaseConfirmDialogOpen(false);

    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);
    const openDeleteUserConfirmDialog = () => setIsDeleteUserConfirmDialogOpen(true);
    const closeDeleteUserConfirmDialog = () => setIsDeleteUserConfirmDialogOpen(false);

    const [isSignOutConfirmDialogOpen, setIsSignOutConfirmDialogOpen] = useState(false);
    const openSignOutConfirmDialog = () => setIsSignOutConfirmDialogOpen(true);
    const closeSignOutConfirmDialog = () => setIsSignOutConfirmDialogOpen(false);

    const [isStoppingServerConfirmDialogOpen, setIsStoppingServerConfirmDialogOpen] = useState(false);
    const openStoppingServerConfirmDialog = () => setIsStoppingServerConfirmDialogOpen(true);
    const closeStoppingServerConfirmDialog = () => setIsStoppingServerConfirmDialogOpen(false);

    const [isStoppingDatabaseConfirmDialogOpen, setIsStoppingDatabaseConfirmDialogOpen] = useState(false);
    const openStoppingDatabaseConfirmDialog = () => setIsStoppingDatabaseConfirmDialogOpen(true);
    const closeStoppingDatabaseConfirmDialog = () => setIsStoppingDatabaseConfirmDialogOpen(false);

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
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setIsSigningOut(false);
            });
    }

    const handleStopServer = async () => {
        setSnackbarOpen(false);

        closeStoppingServerConfirmDialog();

        return server.stop()
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setIsLogged(false);
            });
    }

    const handleStopDatabase = async () => {
        setSnackbarOpen(false);

        closeStoppingDatabaseConfirmDialog();

        return db.stop()
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setIsLogged(false);
            });
    }


    const handleDeleteUser = async () => {
        setSnackbarOpen(false);

        closeDeleteUserConfirmDialog();

        return deleteUser(userEmail)
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setIsLogged(false);
            });
    }

    const handleFlushDatabase = async () => {
        setSnackbarOpen(false);

        closeFlushDatabaseConfirmDialog();

        return db.flush()
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
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
                open={isFlushDatabaseConfirmDialogOpen}
                title='Flush database'
                text='Are you sure you want to delete all database entries? This cannot be undone! You will then be logged out and redirected to the home page.'
                handleYes={handleFlushDatabase}
                handleNo={closeFlushDatabaseConfirmDialog}
                handleClose={closeFlushDatabaseConfirmDialog}
            />
            <YesNoDialog
                open={isDeleteUserConfirmDialogOpen}
                title='Delete account'
                text={`Are you sure you want to delete user '${userEmail}'? This cannot be undone!`}
                handleYes={handleDeleteUser}
                handleNo={closeDeleteUserConfirmDialog}
                handleClose={closeDeleteUserConfirmDialog}
            />
            <YesNoDialog
                open={isSignOutConfirmDialogOpen}
                title='Sign out'
                text='Are you sure you want to sign out? You will be redirected to the home page.'
                handleYes={handleSignOut}
                handleNo={closeSignOutConfirmDialog}
                handleClose={closeSignOutConfirmDialog}
            />
            <YesNoDialog
                open={isStoppingServerConfirmDialogOpen}
                title='Stop server'
                text='Are you sure you want to stop the server? This cannot be undone!'
                handleYes={handleStopServer}
                handleNo={closeStoppingServerConfirmDialog}
                handleClose={closeStoppingServerConfirmDialog}
            />
            <YesNoDialog
                open={isStoppingDatabaseConfirmDialogOpen}
                title='Stop server'
                text='Are you sure you want to stop the database? This cannot be undone!'
                handleYes={handleStopDatabase}
                handleNo={closeStoppingDatabaseConfirmDialog}
                handleClose={closeStoppingDatabaseConfirmDialog}
            />
            
            <Paper elevation={8} className={classes.root}>
                <Typography variant='h1' className={classes.title}>
                    Administration Panel
                </Typography>
                
                <Typography className={classes.text}>
                    Hello, <strong>[{userEmail}]</strong>. You are logged in as an administrator. Here is your secret:
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
                        loading={isDeletingUser}
                        disabled={isSuperAdmin}
                        onClick={openDeleteUserConfirmDialog}
                    >
                        Delete account
                    </LoadingButton>

                    <LoadingButton
                        className={classes.button}
                        variant='contained'
                        color='error'
                        icon={<DatabaseIcon />}
                        loading={db.isFlushing}
                        disabled={!isSuperAdmin}
                        onClick={openFlushDatabaseConfirmDialog}
                    >
                        Flush database
                    </LoadingButton>

                    <LoadingButton
                        className={classes.button}
                        variant='contained'
                        color='error'
                        icon={<StopServerIcon />}
                        loading={db.isStopping}
                        disabled={!isSuperAdmin}
                        onClick={openStoppingDatabaseConfirmDialog}
                    >
                        Stop database
                    </LoadingButton>

                    <LoadingButton
                        className={classes.button}
                        variant='contained'
                        color='error'
                        icon={<StopServerIcon />}
                        loading={server.isStopping}
                        disabled={!isSuperAdmin}
                        onClick={openStoppingServerConfirmDialog}
                    >
                        Stop server
                    </LoadingButton>
                    
                    <LoadingButton
                        className={classes.button}
                        variant='contained'
                        color='secondary'
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

export default AdminPage;