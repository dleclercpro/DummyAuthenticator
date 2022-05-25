import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const SPACING = 1.5;

const useAuthStyles = makeStyles()(({ palette, breakpoints, spacing }: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 600,
        padding: spacing(3),

        '&.sign-out': {
            maxWidth: 320,
        },

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
        display: 'flex',

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
                marginBottom: spacing(SPACING),
            },
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
            marginTop: spacing(SPACING),
        },
    },

    staySignedInSwitch: {
        marginTop: spacing(-0.5),
    },
}));

export default useAuthStyles;