import React, { createContext, useState } from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createCache from '@emotion/cache';
import useAppStyles from './AppStyles';
import { APP_THEME } from '../config/Config';
import { DarkTheme, LightTheme } from '../styles/Theme';
import Router from '../routes/Router';
import { Container } from '@mui/system';
import { BrowserRouter } from 'react-router-dom';

export const AuthContext = createContext({
    isLogged: false,
    setIsLogged: (isLogged: boolean) => {},
});

export const StylesCache = createCache({ key: 'mui', prepend: true });



interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();

    // Store authentication state here
    const [isLogged, setIsLogged] = useState(false);
    
    return (
        <BrowserRouter>
            <AuthContext.Provider value={{ isLogged, setIsLogged }}>
                <CacheProvider value={StylesCache}>
                    <ThemeProvider theme={APP_THEME === 'dark' ? DarkTheme : LightTheme}>
                        <CssBaseline />
                        
                        <Container className={classes.root} maxWidth='lg'>
                            <Router />
                        </Container>
                    </ThemeProvider>
                </CacheProvider>
            </AuthContext.Provider>
        </BrowserRouter>
    );
}

export default App;