import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useLoadingButtonStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {
        minWidth: 150,
        height: spacing(7),
    },
}));

export default useLoadingButtonStyles;