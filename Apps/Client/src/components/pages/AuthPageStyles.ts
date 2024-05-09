import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../styles';

const useAuthPageStyles = makeStyles()(({ breakpoints, spacing }: Theme) => ({
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
    },

    titleContainer: {

    },

    title: {
        marginBottom: spacing(0.5 * SPACING),
    },

    textContainer: {
        display: 'flex',
        alignItems: 'center',
    },

    text: {
        marginTop: spacing(2 * SPACING),
        marginBottom: spacing(1 * SPACING),
    },

    fields: {
        border: 0,
        padding: 0,
        margin: 0,
        display: 'flex',
        marginBottom: spacing(1),

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

            '.reset-password &': {
                marginRight: 0,
                marginBottom: spacing(SPACING / 2),
            },
        },
    },

    buttons: {
        display: 'flex',
        flexDirection: 'column',

        '& > .top': {
            display: 'flex',
            justifyContent: 'space-between',

            '&:not(:last-child)': {
                marginBottom: spacing(SPACING / 2),
            },
        },

        '& > .bottom': {
            display: 'flex',
            justifyContent: 'space-between',
        },
    },

    linkButton: {
        height: spacing(BUTTON_HEIGHT),
    },

    switchButton: {
        height: spacing(BUTTON_HEIGHT),
        marginBottom: spacing(0.5),
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

    icon: {
        width: spacing(6),
        height: spacing(6),

        marginRight: spacing(SPACING),
    },
}));

export default useAuthPageStyles;