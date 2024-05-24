import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../styles';

const useDashboardPageStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 620,
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
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing(1),

        [breakpoints.down('sm')]: {
            gridTemplateColumns: spacing(1),
        },

        '& > :last-child': {
            gridColumn: 'span 2',

            [breakpoints.down('sm')]: {
                gridColumn: 'span 1',
            },
        },
    },

    button: {
        width: '100%',
        height: spacing(BUTTON_HEIGHT),
    },
}));

export default useDashboardPageStyles;