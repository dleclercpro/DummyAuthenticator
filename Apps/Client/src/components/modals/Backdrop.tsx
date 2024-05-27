import React from 'react';
import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material';
import useBackdropStyles from './BackdropStyles';
import useBackdrop from '../../contexts/BackdropContext';

interface Props {
    id?: string,
    className?: string,
}

const Backdrop: React.FC<Props> = (props) => {
    const { id, className } = props;

    const { classes } = useBackdropStyles();

    const backdrop = useBackdrop();

    return (
      <MuiBackdrop
        id={id}
        className={`${classes.root} ${className}`}
        open={backdrop.isVisible}
      >
        <CircularProgress color='inherit' />
      </MuiBackdrop>
    );
}

export default Backdrop;