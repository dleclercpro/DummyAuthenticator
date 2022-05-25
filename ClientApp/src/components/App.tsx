import React from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createCache from '@emotion/cache';
import Login from './Login';
import useAppStyles from './AppStyles';
import { APP_THEME } from '../config/Config';
import { DarkTheme, LightTheme } from '../styles/Theme';

export const Cache = createCache({ key: 'mui', prepend: true });

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();
    
    return (
        <CacheProvider value={Cache}>
            <ThemeProvider theme={APP_THEME === 'dark' ? DarkTheme : LightTheme}>
                <CssBaseline />
                
                <div className={classes.root}>
                    <Login />
                </div>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;