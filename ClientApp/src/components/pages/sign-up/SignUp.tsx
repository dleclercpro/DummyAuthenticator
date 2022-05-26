import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthStyles from '../AuthStyles';
import Snackbar from '../../Snackbar';
import { Link } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import useSignUp from '../../../hooks/useSignUp';
import EmailField from '../../fields/EmailField';
import PasswordField from '../../fields/PasswordField';
import LoadingButton from '../../buttons/LoadingButton';
import CreateIcon from '@mui/icons-material/Create';

interface Props {

}

const SignUp: React.FC<Props> = () => {
    const { classes } = useAuthStyles();

    const { loading, error, resetError, signUp } = useSignUp();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSnackbarOpen(false);

        await signUp(email, password);
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

                <Button
                    className={classes.switchButton}
                    component={Link}
                    to={getURL(Page.SignIn)}
                    color='secondary'
                >
                    Already have an account? Click here.
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

export default SignUp;