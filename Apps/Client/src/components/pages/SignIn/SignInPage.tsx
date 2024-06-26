import { Button, Switch, FormControlLabel, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import Snackbar from '../../Snackbar';
import { Link, useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import EmailField from '../../fields/EmailField';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import KeyIcon from '@mui/icons-material/Key';
import useAuthContext from '../../../contexts/AuthContext';
import useSignInPageStyles from './SignInPageStyles';

interface Props {

}

const SignInPage: React.FC<Props> = () => {
    const { classes } = useSignInPageStyles();

    const { signIn } = useAuthContext();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

        setLoading(true);
        setSnackbarOpen(false);

        return signIn(email, password, staySignedIn)
            .then((user) => {
                navigate(getURL(user.isAdmin || user.isSuperAdmin ? Page.Admin : Page.Home));
            })
            .catch((err: any) => {
                setError(err.message);
                setLoading(false);

                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
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
                    Not registered yet?
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
                    <div className='top'>
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
                    <div className='bottom'>
                        <Button
                            className={classes.linkButton}
                            component={Link}
                            to={getURL(Page.ForgotPassword)}
                            color='secondary'
                            startIcon={<KeyIcon />}
                        >
                            Forgot your password?
                        </Button>
                    </div>
                </div>
            </form>

            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={Severity.Error}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default SignInPage;