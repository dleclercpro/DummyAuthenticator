import { Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { CallSignIn } from '../calls/auth/CallSignIn';
import { Severity } from '../types/CommonTypes';
import ShowPasswordButton from './buttons/ShowPasswordButton';
import useLoginStyles from './LoginStyles';
import Snackbar from './Snackbar';

interface Props {

}

const Login: React.FC<Props> = () => {
    const { classes } = useLoginStyles();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const Spinner = (
        <CircularProgress
            className={classes.spinner}
            size='1rem'
            thickness={6}
            color='inherit'
        />
    );

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSnackbarOpen(false);
        setLoading(true);

        try {
            await new CallSignIn().execute({ email, password });
            
        } catch (err: any) {
            setError('Invalid credentials.');

            setSnackbarOpen(true);
        }

        setLoading(false);
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
                    Welcome
                </Typography>

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
                    InputProps={{ endAdornment: <ShowPasswordButton visible={showPassword} onClick={togglePasswordVisibility} />}}
                    type={showPassword ? 'text' : 'password'}
                    label='Password'
                    value={password}
                    error={!!error}
                    onChange={handlePasswordChange}
                    fullWidth
                />

                <Button
                    className={classes.button}
                    type='submit'
                    variant='contained'
                    endIcon={loading && Spinner}
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