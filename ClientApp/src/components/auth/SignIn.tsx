import { Button, Switch, FormControlLabel, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useSignIn from '../../hooks/useSignIn';
import { Severity } from '../../types/CommonTypes';
import useAuthStyles from './AuthStyles';
import Snackbar from '../Snackbar';
import { Link, useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../routes/Router';
import EmailField from '../fields/EmailField';
import PasswordField from '../fields/PasswordField';
import LoadingButton from '../buttons/LoadingButton';

interface Props {

}

const SignIn: React.FC<Props> = () => {
    const { classes } = useAuthStyles();

    const navigate = useNavigate();

    const { loading, error, resetError, signIn } = useSignIn();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [staySignedIn, setStaySignedIn] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);

    // New error: open snackbar
    useEffect(() => {
        if (!!error) {
            setSnackbarOpen(true);
        }
        
    }, [error]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        resetError();
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        resetError();
    }

    const handleStaySignedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStaySignedIn(e.target.checked);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSnackbarOpen(false);

            await signIn(email, password, staySignedIn);
        
            navigate(getURL(Page.Home));
        
        } catch (err: any) {

        }
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
                        label={<Typography>Stay signed in?</Typography>}
                    />

                    <LoadingButton
                        className={classes.submitButton}
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