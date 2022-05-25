import React, { useMemo } from 'react';
import { Snackbar as MuiSnackbar, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { SNACKBAR_DURATION } from '../config/Config';
import useSnackbarStyles from './SnackbarStyles';
import { Severity } from '../types/CommonTypes';

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

    const { className, open, message, severity, onClose } = props;

    const Icon = useMemo(() => {
        switch (severity) {
            case Severity.Error:
                return ErrorIcon;
            case Severity.Warning:
                return WarningIcon;
        }

        return null;

    }, [severity]);

    return (
        <MuiSnackbar
            className={`${classes.root} ${className ? className : ''}`}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            ContentProps={{ className: `${classes.content} ${severity ? severity : ''}`, classes: { message: classes.message } }}
            open={open}
            autoHideDuration={SNACKBAR_DURATION}
            onClose={onClose}
            message={<>
                {Icon && <Icon className={classes.icon} />}
                <Typography>{message}</Typography>
            </>}
            action={
                <IconButton size='small' color='inherit' onClick={onClose}>
                    <CloseIcon fontSize='small' />
                </IconButton>
            }
        />
    );
}

export default Snackbar;