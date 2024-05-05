import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAuthStyles from '../AuthStyles';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Page, getURL } from '../../../routes/Router';
import * as CallValidateToken from '../../../models/calls/auth/CallValidateToken';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/WarningSharp';
import BackIcon from '@mui/icons-material/ArrowBack';
import { ConfirmEmailToken } from '../../../types/TokenTypes';

interface Props {

}

const ConfirmEmail: React.FC<Props> = () => {
    const { classes } = useAuthStyles();
    
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') ?? '';

    const { confirmEmail } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [validatedToken, setValidatedToken] = useState<{ string: string, content: ConfirmEmailToken } | null>(null);

    // Validate token
    useEffect(() => {
        if (!token) return;

        new CallValidateToken.default().execute({ token })
            .then(({ data }) => {
                setValidatedToken(data! as { string: string, content: ConfirmEmailToken });
            })
            .catch(() => {
                // Invalid token: bring user back home
                navigate(getURL(Page.Home));
            });

    }, [token]);

    // Confirm e-mail address once token has been validated
    useEffect(() => {
        if (validatedToken === null) return;

        setLoading(true);

        confirmEmail(token)
            .then(() => {
                setError('');
            })
            .catch((err: any) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [validatedToken]);

    /* Token not yet validated by server */
    if (validatedToken === null) {
        return null;
    }

    /* No token provided: go back home */
    if (token === null) {
        return (
            <Navigate to={getURL(Page.Home)} />
        );
    }

    return (
        <Paper elevation={8} className={classes.root}>
            <div className={`${classes.form} confirm-email`}>
                <Typography variant='h1' className={classes.title}>
                    Confirm e-mail
                </Typography>

                <div className={classes.textContainer}>
                    {!loading && !error && <SuccessIcon color='success'  className={classes.icon} />}
                    {!loading && !!error && <ErrorIcon color='error' className={classes.icon} />}

                    <Typography className={classes.text}>
                        {loading && 'Please wait...'}
                        {!loading && !error && `Thanks for confirming your e-mail address!`}
                        {!loading && !!error && `Could not confirm your e-mail address: ${error}`}
                    </Typography>
                </div>

                <div className={classes.buttons}>
                    <Button
                        className={classes.linkButton}
                        component={Link}
                        to={getURL(Page.SignIn)}
                        color='secondary'
                        startIcon={<BackIcon />}
                    >
                        Back to homepage
                    </Button>
                </div>
            </div>
        </Paper>
    );
}

export default ConfirmEmail;