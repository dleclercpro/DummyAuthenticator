import { Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import ResetIcon from '@mui/icons-material/LockReset';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { translateServerError } from '../../../errors/ServerErrors';
import { Page, getURL } from '../../../routes/Router';

interface Props {

}

const ResetPassword: React.FC<Props> = () => {
    const { classes } = useAuthStyles();
    
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const { resetPassword } = useAuth();

    const token = queryParams.get('token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);

    // New error: open snackbar
    useEffect(() => {
        if (!!error) {
            setSnackbarOpen(true);
        }
        
    }, [error]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);

        if (e.target.value !== passwordRepeat) {
            setError('Passwords must match!');
            return;
        }

        setError('');
    }

    const handlePasswordRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(e.target.value);

        if (password !== e.target.value) {
            setError('Passwords must match!');
            return;
        }

        setError('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (token === null) {
            return;
        }

        setSnackbarOpen(false);
        setLoading(true);

        return resetPassword(token, password)
            .then(() => {
                navigate(getURL(Page.Home));
            })
            .catch((err: any) => {
                setError(translateServerError(err.message));
                setSnackbarOpen(true);
            })
            .finally(() => {
                setLoading(false);
            });
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

export default ResetPassword;