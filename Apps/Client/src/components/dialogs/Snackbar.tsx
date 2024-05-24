import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { SNACKBAR_DURATION } from '../../config/Config';
import useSnackbarStyles from './SnackbarStyles';
import { Severity } from '../../types/CommonTypes';

interface Props {
    id?: string,
    className?: string,
    open: boolean,
    message: string,
    severity?: Severity,
    onClose: () => void,
}

const Snackbar: React.FC<Props> = (props) => {
    const { classes } = useSnackbarStyles();

    const { open, message, severity, onClose } = props;

    return (
        <MuiSnackbar
            className={classes.root}
            open={open}
            autoHideDuration={SNACKBAR_DURATION}
            onClose={onClose}
        >
            <Alert
                className={classes.alert}
                variant='filled'
                severity={severity}
                onClose={onClose}
            >
                {message}
            </Alert>
        </MuiSnackbar>
    );
}

export default Snackbar;