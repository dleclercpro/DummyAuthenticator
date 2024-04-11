import { Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import ResetIcon from '@mui/icons-material/LockReset';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { translateServerError } from '../../../errors/ServerErrors';
import { Page } from '../../../routes/Router';

interface Props {

}

const ResetPassword: React.FC<Props> = () => {
    const { classes } = useAuthStyles();
    
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const { resetPassword } = useAuth();

    const token = queryParams.get('token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // New error: open snackbar
    useEffect(() => {
        if (!!error) {
            setSnackbarOpen(true);
        }
        
    }, [error]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    }

    const handlePasswordRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(e.target.value);
        setError('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (token === null) {
            return;
        }

        if (password !== passwordRepeat) {
            setError('Passwords must match!');
            return;
        }

        setSnackbarOpen(false);
        setLoading(true);

        return resetPassword(token, password)
            .then(() => {
                setError('');
                setSnackbarMessage('Please check your e-mail to recover your password!');
                setSnackbarOpen(true);
            })
            .catch((err: any) => {
                const error = translateServerError(err.message);

                setError(error);
                setSnackbarMessage(error);
                setSnackbarOpen(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /* No token provided: go back home */
    if (token === null) {
        return (
            <Navigate to={`/${Page.Home}`} />
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
                        onChange={handlePasswordChange}
                    />

                    <PasswordField
                        id='password-repeat'
                        className={classes.field}
                        label='Repeat password'
                        value={passwordRepeat}
                        error={!!error}
                        onChange={handlePasswordRepeatChange}
                    />
                </fieldset>

                <div className={classes.buttons}>
                    <div className='top'>
                        <LoadingButton
                            className={classes.submitButton}
                            type='submit'
                            icon={<ResetIcon />}
                            loading={loading}
                            error={!!error}
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