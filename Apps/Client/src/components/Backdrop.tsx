import React from 'react';
import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material';
import useBackdropStyles from './BackdropStyles';
import useBackdrop from '../hooks/useBackdrop';

interface Props {
    id?: string,
    className?: string,
}

const Backdrop: React.FC<Props> = (props) => {
    const { id, className } = props;

    const { classes } = useBackdropStyles();

    const { isVisible, toggle } = useBackdrop();

    return (
      <MuiBackdrop
        id={id}
        className={`${classes.root} ${className}`}
        open={isVisible}
        onClick={toggle}
      >
        <CircularProgress color='inherit' />
      </MuiBackdrop>
    );
}

export default Backdrop;