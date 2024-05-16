import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../../styles';

const useHomePageStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
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
        background: '#ffffff',
        color: '#000000',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.9)',
        padding: `${spacing(SPACING)} ${spacing(2 * SPACING)}`,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: spacing(2 * SPACING),
    },

    fields: {
        display: 'flex',
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

export default useHomePageStyles;