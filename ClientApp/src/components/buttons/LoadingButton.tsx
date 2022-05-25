import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { classnames } from 'tss-react/tools/classnames';
import Spinner from '../Spinner';
import useLoadingButtonStyles from './LoadingButtonStyles';

interface Props {
    children: ReactNode,
    className?: string,
    loading: boolean,
    error?: boolean,
}

const LoadingButton: React.FC<Props> = (props) => {
    const { children, className, loading, error } = props;
    
    const { classes } = useLoadingButtonStyles();

    return (
        <Button
            className={classnames([classes.root, className])}
            type='submit'
            variant='contained'
            endIcon={loading && <Spinner />}
            disabled={!!error}
        >
            {children}
        </Button>
    );
}

export default LoadingButton;