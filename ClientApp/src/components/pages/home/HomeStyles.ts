import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { SPACING } from '../../../styles';

const useHomeStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
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

        '&:not(:last-child)': {
            marginBottom: spacing(1),
        },
    },
}));

export default useHomeStyles;