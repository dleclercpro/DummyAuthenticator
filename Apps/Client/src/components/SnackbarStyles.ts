import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useSnackbarStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {

    },

    alert: {
        width: '100%',
    },
}));

export default useSnackbarStyles;