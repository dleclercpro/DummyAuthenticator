import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { BUTTON_HEIGHT, SPACING } from '../../styles';

export const createFormStyles = ({ palette, breakpoints, spacing }: Theme): Record<string, CSSObject> => ({
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
    
    submitButton: {
        marginLeft: 'auto',

        [breakpoints.down('sm')]: {
            marginLeft: 0,
            marginTop: spacing(1),
        },
    },

    linkButton: {
        height: spacing(BUTTON_HEIGHT),
    },
});

// Use createFormStyles to create a styles object for the current component
const useFormStyles = makeStyles()(createFormStyles);

export default useFormStyles;