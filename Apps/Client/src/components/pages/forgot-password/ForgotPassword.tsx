import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import EmailField from '../../fields/EmailField';
import LoadingButton from '../../buttons/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import useAuth from '../../../hooks/useAuth';
import { Page, getURL } from '../../../routes/Router';
import { translateServerError } from '../../../errors/ServerErrors';
import { Link } from 'react-router-dom';

interface Props {

}

const ForgotPassword: React.FC<Props> = () => {
    const { classes } = useAuthStyles();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { forgotPassword } = useAuth();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setSnackbarOpen(false);
        setLoading(true);

        return forgotPassword(email)
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
                        onChange={handleEmailChange}
                    />
                </fieldset>

                <div className={classes.buttons}>
                    <div className='top'>
                        <LoadingButton
                            className={classes.submitButton}
                            type='submit'
                            icon={<SendIcon />}
                            loading={loading}
                            error={!!error}
                        >
                            Send link
                        </LoadingButton>
                    </div>
                    <div className='bottom'>
                        <Button
                            className={classes.linkButton}
                            component={Link}
                            to={getURL(Page.SignIn)}
                            color='secondary'
                        >
                            I remember my password!
                        </Button>
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

export default ForgotPassword;