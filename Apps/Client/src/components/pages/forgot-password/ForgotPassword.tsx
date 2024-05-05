import { Button, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import EmailField from '../../fields/EmailField';
import LoadingButton from '../../buttons/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import BackIcon from '@mui/icons-material/ArrowBack';
import useAuth from '../../../hooks/useAuth';
import { Page, getURL } from '../../../routes/Router';
import { Link, useNavigate } from 'react-router-dom';
import TimeDuration from '../../../models/TimeDuration';
import { TimeUnit } from '../../../types/TimeTypes';
import { sleep } from '../../../utils/time';

interface Props {

}

const ForgotPassword: React.FC<Props> = () => {
    const { classes } = useAuthStyles();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [email, setEmail] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { forgotPassword } = useAuth();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setSnackbarOpen(false);
        setLoading(true);

        return forgotPassword(email)
            .then(() => {
                setError(false);
                setSnackbarMessage('Please check your e-mail to recover your password!');
                setSnackbarOpen(true);

                return sleep(new TimeDuration(5, TimeUnit.Second));
            })
            .then(() => {
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

    return (
        <Paper elevation={8} className={classes.root}>
            <form
                className={classes.form}
                autoComplete='off'
                onSubmit={handleSubmit}
            >
                <Typography variant='h1' className={classes.title}>
                    Forgot your password?
                </Typography>

                <Typography className={classes.text}>
                    Please enter your e-mail address, and we'll send you an e-mail with a link to recover your password:
                </Typography>

                <fieldset className={classes.fields}>
                    <EmailField
                        id='email'
                        className={classes.field}
                        value={email}
                        error={!!error}
                        disabled={loading}
                        onChange={handleEmailChange}
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
                            Back
                        </Button>
                        <LoadingButton
                            className={classes.submitButton}
                            type='submit'
                            icon={<SendIcon />}
                            loading={loading}
                            error={!!error}
                            disabled={loading || email === ''}
                        >
                            Send link
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

export default ForgotPassword;