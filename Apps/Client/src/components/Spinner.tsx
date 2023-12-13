import { CircularProgress } from '@mui/material';
import useSpinnerStyles from './SpinnerStyles';

type Size = 'small' | 'medium' | 'large';

interface Props {
    size?: Size,
}

const Spinner: React.FC<Props> = (props) => {
    const { classes } = useSpinnerStyles();

    let { size } = props;

    size = size ? size : 'small';

    const getSize = (s: Size) => {
        switch (s) {
            case 'small':
                return '1em';
            case 'medium':
                return '2em';
            case 'large':
                return '3em';
        }
    }

    const getThickness = (s: Size) => {
        switch (s) {
            case 'small':
                return 6;
            case 'medium':
                return 5;
            case 'large':
                return 4;
        }
    }

    return (
        <CircularProgress
            className={classes.root}
            size={getSize(size)}
            thickness={getThickness(size)}
            color='inherit'
        />
    );
}

export default Spinner;