import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useEmailFieldStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {

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
}));

export default useEmailFieldStyles;