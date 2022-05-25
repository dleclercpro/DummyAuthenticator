import { CircularProgress } from '@mui/material';
import useSpinnerStyles from './SpinnerStyles';

interface Props {

}

const Spinner: React.FC<Props> = () => {
    const { classes } = useSpinnerStyles();

    return (
        <CircularProgress
            className={classes.root}
            size='1rem'
            thickness={6}
            color='inherit'
        />
    );
}

export default Spinner;