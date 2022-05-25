import React from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createCache from '@emotion/cache';
import useAppStyles from './AppStyles';
import { APP_THEME } from '../config/Config';
import { DarkTheme, LightTheme } from '../styles/Theme';
import Router from '../routes/Router';
import { Container } from '@mui/system';

export const Cache = createCache({ key: 'mui', prepend: true });

interface Props {

}

const App: React.FC<Props> = (props) => {
    const { classes } = useAppStyles();
    
    return (
        <CacheProvider value={Cache}>
            <ThemeProvider theme={APP_THEME === 'dark' ? DarkTheme : LightTheme}>
                <CssBaseline />
                
                <Container className={classes.root} maxWidth='lg'>
                    <Router />
                </Container>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;