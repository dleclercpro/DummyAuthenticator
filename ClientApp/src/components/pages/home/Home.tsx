import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSignOut from '../../../hooks/useSignOut';
import { Severity } from '../../../types/CommonTypes';
import useHomeStyles from './HomeStyles';
import Snackbar from '../../Snackbar';
import LoadingButton from '../../buttons/LoadingButton';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import useUser from '../../../hooks/useUser';

interface Props {

}

const Home: React.FC<Props> = () => {
    const { classes } = useHomeStyles();

    const { loading: loadingUser, error: errorUser, user, getUser } = useUser();
    const { loading: loadingSignOut, error: errorSignOut, signOut } = useSignOut();

    const [snackbarOpen, setSnackbarOpen] = useState(!!errorSignOut);

    // New error: open snackbar
    useEffect(() => {
        if (!!errorSignOut || !!errorUser || !!user) {
            setSnackbarOpen(true);
        }
        
    }, [errorSignOut, errorUser, user]);

    const onRefresh = async () => {
        setSnackbarOpen(false);

        await getUser();
    }

    const onSignOut = async () => {
        setSnackbarOpen(false);

        await signOut();
    }

    return (
        <Paper elevation={8} className={classes.root}>
            <Typography variant='h1' className={classes.title}>
                Home
            </Typography>
            
            <Typography className={classes.text}>
                You have successfully logged in.
            </Typography>

            <div className={classes.buttons}>
                <LoadingButton
                    className={classes.button}
                    variant='outlined'
                    color='secondary'
                    icon={<RefreshIcon />}
                    loading={loadingUser}
                    onClick={onRefresh}
                >
                    Refresh
                </LoadingButton>
                
                <LoadingButton
                    className={classes.button}
                    type='submit'
                    icon={<LogoutIcon />}
                    loading={loadingSignOut}
                    onClick={onSignOut}
                >
                    Sign out
                </LoadingButton>
            </div>

            <Snackbar
                open={snackbarOpen}
                message={errorSignOut || errorUser || user}
                severity={!!errorSignOut || !!errorUser ? Severity.Error : Severity.Info}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default Home;