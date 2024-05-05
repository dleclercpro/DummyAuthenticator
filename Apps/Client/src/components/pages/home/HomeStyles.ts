import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../../styles';

const useHomeStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 420,
        padding: spacing(3),

        [breakpoints.down('sm')]: {
            padding: spacing(2),
        },
    },

    title: {
        marginBottom: spacing(SPACING),
    },

    text: {
        marginBottom: spacing(1.5 * SPACING),
    },

    secret: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing(1.5 * SPACING),
    },

    buttons: {
        display: 'flex',
        flexDirection: 'column',
    },

    button: {
        width: '100%',
        height: spacing(BUTTON_HEIGHT),

        '&:not(:last-child)': {
            marginBottom: spacing(1),
        },
    },
}));

export default useHomeStyles;