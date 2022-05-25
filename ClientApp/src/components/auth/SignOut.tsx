import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSignOut from '../../hooks/useSignOut';
import { Severity } from '../../types/CommonTypes';
import useAuthStyles from './AuthStyles';
import Snackbar from '../Snackbar';
import { useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../routes/Router';
import LoadingButton from '../buttons/LoadingButton';
import { classnames } from 'tss-react/tools/classnames';

interface Props {

}

const SignOut: React.FC<Props> = () => {
    const { classes } = useAuthStyles();

    const navigate = useNavigate();

    const { loading, error, signOut } = useSignOut();

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);

    // New error: open snackbar
    useEffect(() => {
        if (!!error) {
            setSnackbarOpen(true);
        }
        
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSnackbarOpen(false);

            await signOut();

        } catch (err: any) {

        }

        navigate(getURL(Page.SignIn));
    }

    return (
        <Paper elevation={8} className={classnames([classes.root, 'sign-out'])}>
            <form
                className={classes.form}
                autoComplete='off'
                onSubmit={handleSubmit}
            >
                <Typography variant='h1' className={classes.title}>
                    Home
                </Typography>

                <div className={classes.buttons}>
                    <LoadingButton
                        className={classes.submitButton}
                        loading={loading}
                        error={!!error}
                    >
                        Sign out
                    </LoadingButton>
                </div>
            </form>

            <Snackbar
                open={snackbarOpen}
                message={error}
                severity={Severity.Error}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default SignOut;