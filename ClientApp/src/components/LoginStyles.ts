import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useLoginStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 450,
        padding: spacing(3),
    },
    
    form: {
        display: 'flex',
        flexDirection: 'column',
    },

    title: {
        marginBottom: spacing(3),
    },

    field: {

        '&:not(:last-child)': {
            marginBottom: spacing(1.5),
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

    button: {
        height: spacing(7),
    },

    spinner: {

    },
}));

export default useLoginStyles;