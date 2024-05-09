import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../../styles';

const useNoMatchPageStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 320,
        padding: spacing(3),

        [breakpoints.down('sm')]: {
            padding: spacing(2),
        },
    },

    icon: {
        width: spacing(10),
        height: spacing(10),
        margin: 'auto',
        marginBottom: spacing(SPACING),
    },

    title: {
        marginBottom: spacing(SPACING),
    },

    text: {
        marginBottom: spacing(SPACING),
    },

    buttons: {
        display: 'flex',
        flexDirection: 'column',
    },

    button: {
        width: '100%',
        height: spacing(BUTTON_HEIGHT),
    },
}));

export default useNoMatchPageStyles;