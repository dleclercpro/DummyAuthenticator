import { Button } from '@mui/material';
import React, { ReactNode } from 'react';
import { classnames } from 'tss-react/tools/classnames';
import Spinner from '../Spinner';
import useLoadingButtonStyles from './LoadingButtonStyles';

interface Props {
    children: React.ReactNode,
    className?: string,
    type?: 'button' | 'submit',
    variant?: 'contained' | 'outlined' | 'text',
    color?: 'primary' | 'secondary' | 'success' | 'error',
    icon?: ReactNode,
    loading: boolean,
    error?: boolean,
    disabled?: boolean,
    onClick?: (e: React.FormEvent) => any | Promise<any>,
}

const LoadingButton: React.FC<Props> = (props) => {
    const { children, className, type, variant, color, icon, loading, error, disabled, onClick } = props;
    
    const { classes } = useLoadingButtonStyles();

    return (
        <Button
            className={classnames([classes.root, className])}
            type={type ? type : 'button'}
            variant={variant ? variant : 'contained'}
            color={color ? color : 'primary'}
            endIcon={loading && <Spinner />}
            disabled={disabled || loading || !!error}
            onClick={onClick}
            startIcon={icon}
        >
            {children}
        </Button>
    );
}

export default LoadingButton;