import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import Snackbar from '../../Snackbar';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import ResetIcon from '@mui/icons-material/LockReset';
import BackIcon from '@mui/icons-material/ArrowBack';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuthContext from '../../../contexts/AuthContext';
import { Page, getURL } from '../../../routes/Router';
import { sleep } from '../../../utils/time';
import TimeDuration from '../../../models/TimeDuration';
import { TimeUnit } from '../../../types/TimeTypes';
import { ResetPasswordToken } from '../../../types/TokenTypes';
import useToken from '../../../hooks/useToken';
import useResetPasswordPageStyles from './ResetPasswordPageStyles';

interface Props {

}

const ResetPasswordPage: React.FC<Props> = () => {
    const { classes } = useResetPasswordPageStyles();
    
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const { isLogged, setIsLogged, resetPassword } = useAuthContext();
    const token = useToken<ResetPasswordToken>(queryParams.get('token') ?? '');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Validate token
    useEffect(() => {
        if (!token.validatedValue || isLogged) {
            return;
        }

        token.validate()
            .catch(() => {
                // Invalid token: bring user back home
                navigate(getURL(Page.Home));
            });

    }, [token.validatedValue]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError(false);
    }

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
        setError(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogged && token.unvalidatedValue === null) {
            return;
        }

        if (password !== repeatPassword) {
            setError(true);
            setSnackbarMessage('Passwords must match!');
            setSnackbarOpen(true);
            return;
        }

        setSnackbarOpen(false);
        setLoading(true);

        return resetPassword(password, token.validatedValue)
            .then(async () => {
                setError(false);
                setSnackbarMessage('Your password has been successfully reset!');
                setSnackbarOpen(true);

                // Wait a bit for user to see snackbar
                await sleep(new TimeDuration(5, TimeUnit.Second));

                // Log out (in case user is logged in) after resetting password
                setIsLogged(false);

                // Take user to home page after resetting password
                navigate(getURL(Page.Home));
            })
            .catch((err: any) => {
                setError(true);
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /* Token not yet validated by server */
    if (!isLogged && token.validatedValue === null) {
        return null;
    }

    /* No token provided: go back home */
    if (!isLogged && token.unvalidatedValue === null) {
        return (
            <Navigate to={getURL(Page.Home)} />
        );
    }

    return (
        <Paper elevation={8} className={classes.root}>
            <form
                className={`${classes.form} reset-password`}
                autoComplete='off'
                onSubmit={handleSubmit}
            >
                <Typography variant='h1' className={classes.title}>
                    Reset your password
                </Typography>

                <Typography className={classes.text}>
                    Please choose a new password for your account:
                </Typography>

                <fieldset className={classes.fields}>
                    <PasswordField
                        id='password'
                        className={classes.field}
                        value={password}
                        error={!!error}
                        disabled={loading}
                        onChange={handlePasswordChange}
                    />

                    <PasswordField
                        id='password-repeat'
                        className={classes.field}
                        label='Repeat password'
                        value={repeatPassword}
                        error={!!error}
                        disabled={loading}
                        onChange={handleRepeatPasswordChange}
                    />
                </fieldset>

                <div className={classes.buttons}>
                    <div className='top'>
                        <Button
                            className={classes.linkButton}
                            component={Link}
                            to={getURL(Page.SignIn)}
                            color='secondary'
                            startIcon={<BackIcon />}
                        >
                            {isLogged ? 'Back' : 'Back to homepage'}
                        </Button>
                        <LoadingButton
                            className={classes.submitButton}
                            type='submit'
                            icon={<ResetIcon />}
                            loading={loading}
                            error={!!error}
                            disabled={password === '' || password !== repeatPassword}
                        >
                            Reset password
                        </LoadingButton>
                    </div>
                </div>
            </form>

            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={!!error ? Severity.Error : Severity.Success}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default ResetPasswordPage;