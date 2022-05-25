import { Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { classnames } from 'tss-react/tools/classnames';
import useSignIn from '../hooks/useSignIn';
import { Severity } from '../types/CommonTypes';
import ViewButton from './buttons/ViewButton';
import useLoginStyles from './LoginStyles';
import Snackbar from './Snackbar';
import Spinner from './Spinner';

interface Props {

}

const Login: React.FC<Props> = () => {
    const { classes } = useLoginStyles();

    const { loading, error, resetError, signIn } = useSignIn();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(!!error);
    const [showPassword, setShowPassword] = useState(false);

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSnackbarOpen(false);

        await signIn(email, password);
    }

    return (
        <Paper elevation={8} className={classes.root}>
            <form
                className={classes.form}
                noValidate
                autoComplete='off'
                onSubmit={handleSubmit}
            >
                <Typography variant='h1' className={classes.title}>
                    Welcome back
                </Typography>

                <Button
                    className={classnames([classes.field, classes.switchButton])}
                    onClick={() => {}}
                >
                    Not registered yet? Click here.
                </Button>

                <TextField
                    id='email'
                    className={classes.field}
                    inputProps={{ className: classes.input }}
                    type='email'
                    label='E-mail'
                    value={email}
                    error={!!error}
                    onChange={handleEmailChange}
                    fullWidth
                />

                <TextField
                    id='password'
                    className={classes.field}
                    inputProps={{ className: classes.input }}
                    InputProps={{ endAdornment: <ViewButton visible={showPassword} onClick={togglePasswordVisibility} />}}
                    type={showPassword ? 'text' : 'password'}
                    label='Password'
                    value={password}
                    error={!!error}
                    onChange={handlePasswordChange}
                    fullWidth
                />

                <Button
                    className={classnames([classes.field, classes.submitButton])}
                    type='submit'
                    variant='contained'
                    endIcon={loading && <Spinner />}
                    disabled={!!error}
                    fullWidth
                >
                    Log in
                </Button>
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

export default Login;