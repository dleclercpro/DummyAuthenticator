import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../styles';

const useAuthPageStyles = makeStyles()(({ palette, breakpoints, spacing }: Theme) => ({
    root: {
        width: '100%',
        padding: spacing(2),

        [breakpoints.up('sm')]: {
            padding: spacing(3),
        },

        [breakpoints.up('lg')]: {
            maxHeight: `calc(100vh - 100px)`,
            overflowY: 'auto',
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

    table: {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        marginBottom: spacing(SPACING),

        'th, td': {
            width: 'auto',
            textAlign: 'center',
            verticalAlign: 'middle',
            paddingTop: spacing(0.5),
            paddingBottom: spacing(0.5),
        },

        'thead th, tbody td': {
            borderTop: `1px solid grey`,
            borderBottom: `1px solid grey`,
        },

        'button': {

            '&:not(:last-of-type)': {
                marginBottom: spacing(0.5),
            },
        },
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

    input: {

        // Hack to remove ugly auto-filled background in Chrome
        '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${palette.background.default} inset !important`,
            WebkitTextFillColor: palette.text.primary,
            transitionDelay: '9999s',
            transitionProperty: 'background-color, color',
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

    button: {
        width: '100%',
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