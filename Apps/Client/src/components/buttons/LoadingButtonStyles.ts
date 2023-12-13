import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT } from '../../styles';

const useLoadingButtonStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {
        minWidth: 150,
        height: spacing(BUTTON_HEIGHT),
    },
}));

export default useLoadingButtonStyles;