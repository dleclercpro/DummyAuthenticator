import { Theme as MuiTheme, createTheme as createMuiTheme } from '@mui/material';
import { orange, purple } from '@mui/material/colors';
import { APP_THEME } from '../config/Config';

const createResponsiveFonts = (theme: MuiTheme): MuiTheme => {
    const { breakpoints } = theme;

    return {
        ...theme,
        
        typography: {
            ...theme.typography,

            h1: {
                ...theme.typography.h1,
                fontSize: '1.7rem',
                fontWeight: 500,
                lineHeight: 1.25,

                [breakpoints.up('sm')]: {
                    fontSize: '2.0rem',
                },
            },

            h2: {
                ...theme.typography.h2,
                fontSize: '1.55rem',
                fontWeight: 500,
                lineHeight: 1.25,

                [breakpoints.up('sm')]: {
                    fontSize: '1.6rem',
                },
            },

            h3: {
                ...theme.typography.h3,
                fontSize: '1.4rem',
                fontWeight: 500,
                lineHeight: 1.25,

                [breakpoints.up('sm')]: {
                    fontSize: '1.5rem',
                },
            },

            h4: {
                ...theme.typography.h4,
                fontSize: '1.3rem',
                fontWeight: 500,
                lineHeight: 1.25,

                [breakpoints.up('sm')]: {
                    fontSize: '1.4rem',
                },
            },

            h5: {
                ...theme.typography.h5,
                fontSize: '1.2rem',
                fontWeight: 500,
                lineHeight: 1.25,

                [breakpoints.up('sm')]: {
                    fontSize: '1.3rem',
                },
            },

            h6: {
                ...theme.typography.h6,
                fontSize: '1.1rem',
                fontWeight: 500,
                lineHeight: 1.25,

                [breakpoints.up('sm')]: {
                    fontSize: '1.2rem',
                },
            },

            subtitle1: {
                ...theme.typography.subtitle1,
                fontSize: '1.1rem',
                fontWeight: 500,
                lineHeight: 1.5,
            },

            subtitle2: {
                ...theme.typography.subtitle2,
                fontSize: '1rem',
                fontWeight: 500,
                lineHeight: 1.5,
            },

            body1: {
                ...theme.typography.body1,
                fontSize: '1rem',
                lineHeight: 1.5,
            },

            body2: {
                ...theme.typography.body2,
                fontSize: '0.9rem',
                lineHeight: 1.5,
            },

            caption: {
                ...theme.typography.caption,
                fontSize: '0.75rem',
                lineHeight: 1.25,
            },

            button: {
                ...theme.typography.button,
                fontSize: '1rem !important',
                textTransform: 'none',
                textAlign: 'center',
            },
        },
    };
}

const createTheme = (mode: 'dark' | 'light') => createResponsiveFonts(createMuiTheme({
    palette: {
        mode,
        primary: {
            main: purple[500],
        },
        secondary: {
            main: orange[500],
        },
    },
}));

export const DarkTheme = createTheme('dark');
export const LightTheme = createTheme('light');

export const getAppTheme = () => {
    return APP_THEME === 'dark' ? DarkTheme : LightTheme;
}