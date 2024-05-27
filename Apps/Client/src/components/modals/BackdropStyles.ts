import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useBackdropContextStyles = makeStyles()(({ zIndex, palette, spacing }: Theme) => ({
    root: {
        zIndex: zIndex.drawer + 10,
        color: '#ffffff',
    },
}));

export default useBackdropContextStyles;