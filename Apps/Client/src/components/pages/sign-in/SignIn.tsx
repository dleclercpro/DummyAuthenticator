import { Button, Switch, FormControlLabel, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import { Link, useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import EmailField from '../../fields/EmailField';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import useAuth from '../../../hooks/useAuth';
import { translateServerError } from '../../../errors/ServerErrors';

interface Props {

}

const SignIn: React.FC<Props> = () => {
    const { classes } = useAuthStyles();

    const { login } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);

    // New error: open snackbar
    useEffect(() => {
        if (!!error) {
            setSnackbarOpen(true);
        }
        
    }, [error]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
    }

    const handleStaySignedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStaySignedIn(e.target.checked);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setSnackbarOpen(false);
        setLoading(true);

        return login(email, password, staySignedIn)
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
                className={classes.form}
                autoComplete='off'
                onSubmit={handleSubmit}
            >
                <Typography variant='h1' className={classes.title}>
                    Welcome back
                </Typography>

                <Button
                    className={classes.switchButton}
                    component={Link}
                    to={getURL(Page.SignUp)}
                    color='secondary'
                >
                    Not registered yet? Click here.
                </Button>

                <fieldset className={classes.fields}>
                    <EmailField
                        id='email'
                        className={classes.field}
                        value={email}
                        error={!!error}
                        onChange={handleEmailChange}
                    />

                    <PasswordField
                        id='password'
                        className={classes.field}
                        value={password}
                        error={!!error}
                        onChange={handlePasswordChange}
                    />
                </fieldset>

                <div className={classes.buttons}>
                    <FormControlLabel
                        className={classes.staySignedInSwitch}
                        control={<Switch checked={staySignedIn} onChange={handleStaySignedInChange} name='stay-signed-in' />}
                        label='Stay signed in?'
                    />

                    <LoadingButton
                        className={classes.submitButton}
                        type='submit'
                        icon={<LoginIcon />}
                        loading={loading}
                        error={!!error}
                    >
                        Sign in
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

export default SignIn;