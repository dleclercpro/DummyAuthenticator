import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useBackdropStyles = makeStyles()(({ zIndex, palette, spacing }: Theme) => ({
    root: {
        zIndex: zIndex.drawer + 1,
        color: '#ffffff',
    },
}));

export default useBackdropStyles;