import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import ResetIcon from '@mui/icons-material/LockReset';
import BackIcon from '@mui/icons-material/ArrowBack';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Page, getURL } from '../../../routes/Router';
import { sleep } from '../../../utils/time';
import TimeDuration from '../../../models/TimeDuration';
import { TimeUnit } from '../../../types/TimeTypes';
import { CallValidateToken } from '../../../models/calls/auth/CallValidateToken';
import { ResetPasswordToken } from '../../../types/TokenTypes';

interface Props {

}

const ResetPassword: React.FC<Props> = () => {
    const { classes } = useAuthStyles();
    
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') ?? '';

    const { isLogged, resetPassword } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [validatedToken, setValidatedToken] = useState<{ string: string, content: ResetPasswordToken } | null>(null);

    // Validate token
    useEffect(() => {
        if (!token || isLogged) {
            return;
        }

        new CallValidateToken().execute({ token })
            .then(({ data }) => {
                setValidatedToken(data! as { string: string, content: ResetPasswordToken });
                setError(false);
            })
            .catch(() => {
                // Invalid token: bring user back home
                navigate(getURL(Page.Home));
            });

    }, [token, isLogged]);

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

        if (!isLogged && token === null) {
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

        return resetPassword(password, token)
            .then(() => {
                setError(false);
                setSnackbarMessage('Your password has been successfully reset!');
                setSnackbarOpen(true);

                return sleep(new TimeDuration(5, TimeUnit.Second))
                    .then(() => {
                        navigate(getURL(Page.Home));
                    });
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
    if (!isLogged && validatedToken === null) {
        return null;
    }

    /* No token provided: go back home */
    if (!isLogged && token === null) {
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
                            Back to homepage
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
                severity={!!error ? Severity.Error : Severity.Info}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default ResetPassword;