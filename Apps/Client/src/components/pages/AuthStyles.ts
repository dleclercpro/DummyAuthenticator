import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { SPACING } from '../../styles';

const useAuthStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 600,
        padding: spacing(3),

        [breakpoints.down('sm')]: {
            padding: spacing(2),
        },
    },
    
    form: {
        display: 'flex',
        flexDirection: 'column',

        '& > *:not(:last-child)': {
            marginBottom: spacing(SPACING),
        },
    },

    title: {
        marginBottom: spacing(SPACING),
    },

    text: {
        marginBottom: spacing(SPACING),
    },

    fields: {
        border: 0,
        padding: 0,
        margin: 0,
        display: 'flex',

        '.reset-password &': {
            flexDirection: 'column',
        },

        [breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },

    field: {
        width: '100%',

        '&:not(:last-child)': {
            marginRight: spacing(0.5),

            [breakpoints.down('sm')]: {
                marginRight: 0,
                marginBottom: spacing(SPACING / 2),
            },
        },

        '.reset-password &': {
            marginRight: 0,
            marginBottom: spacing(SPACING / 2),
        },
    },

    buttons: {
        display: 'flex',

        [breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },

    switchButton: {

    },
    
    submitButton: {
        marginLeft: 'auto',

        [breakpoints.down('sm')]: {
            marginLeft: 0,
            marginTop: spacing(1),
        },
    },

    staySignedInSwitch: {
        marginTop: spacing(-0.5),
    },
}));

export default useAuthStyles;