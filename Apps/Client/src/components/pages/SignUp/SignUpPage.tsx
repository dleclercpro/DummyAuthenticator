import { Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import Snackbar from '../../Snackbar';
import { Link, useNavigate } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import EmailField from '../../fields/EmailField';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import BackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import useAuth from '../../../hooks/useAuth';
import { sleep } from '../../../utils/time';
import TimeDuration from '../../../models/TimeDuration';
import { TimeUnit } from '../../../types/TimeTypes';
import useSignUpPageStyles from './SignUpPageStyles';

interface Props {

}

const SignUpPage: React.FC<Props> = () => {
    const { classes } = useSignUpPageStyles();

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setSnackbarOpen(false);

        return signUp(email, password)
            .then(async () => {
                setError('');
                
                setSnackbarMessage('You have successfully signed up!');
                setSnackbarOpen(true);

                await sleep(new TimeDuration(5, TimeUnit.Second));

                navigate(getURL(Page.Home));
            })
            .catch((err: any) => {
                setError(err.message);

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
                    Welcome
                </Typography>

                <Typography className={classes.text}>
                    Please choose a username and a password to create your account:
                </Typography>

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
                        <Button
                            className={classes.linkButton}
                            component={Link}
                            to={getURL(Page.SignIn)}
                            color='secondary'
                            startIcon={<BackIcon />}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <LoadingButton
                            className={classes.submitButton}
                            type='submit'
                            icon={<CreateIcon />}
                            loading={loading}
                            error={!!error}
                        >
                            Sign up
                        </LoadingButton>
                    </div>
                </div>
            </form>

            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={error ? Severity.Error : Severity.Success}
                onClose={() => setSnackbarOpen(false)}
            />
        </Paper>
    );
}

export default SignUpPage;