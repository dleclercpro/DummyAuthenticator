import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import usePageStyles from './PageStyles';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Page, getURL } from '../../routes/Router';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/WarningSharp';
import BackIcon from '@mui/icons-material/ArrowBack';
import { ConfirmEmailToken } from '../../types/TokenTypes';
import useToken from '../../hooks/useToken';

interface Props {

}

const ConfirmEmailPage: React.FC<Props> = () => {
    const { classes } = usePageStyles();
    
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const { confirmEmail } = useAuth();
    const token = useToken<ConfirmEmailToken>(queryParams.get('token') ?? '');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Validate token
    useEffect(() => {
        token.validate()
            .catch(() => {
                // Invalid token: bring user back home
                navigate(getURL(Page.Home));
            });

    }, []);

    // Confirm e-mail address once token has been validated
    useEffect(() => {
        if (!token.validatedValue) {
            return;
        }

        setLoading(true);

        confirmEmail(token.validatedValue)
            .then(() => {
                setError('');
            })
            .catch((err: any) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [token.validatedValue]);

    /* Token not yet validated by server */
    if (token.validatedValue === null) {
        return null;
    }

    /* No token provided: go back home */
    if (token.unvalidatedValue === null) {
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
                        {!loading && !!error && `Could not confirm your e-mail address: `}
                        <strong>{error}</strong>
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

export default ConfirmEmailPage;