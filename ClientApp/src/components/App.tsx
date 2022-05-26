import React from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import useAppStyles from './AppStyles';
import { getAppTheme } from '../styles/Theme';
import Router from '../routes/Router';
import { Container } from '@mui/system';
import { AuthContextProvider } from '../hooks/useAuth';
import { StylesCache } from '../styles';
import { BrowserRouter } from 'react-router-dom';

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();

    return (
        <BrowserRouter>
            <AuthContextProvider>
                <CacheProvider value={StylesCache}>
                    <ThemeProvider theme={getAppTheme()}>
                        <CssBaseline />
                        
                        <Container className={classes.root} maxWidth='lg'>
                            <Router />
                        </Container>
                    </ThemeProvider>
                </CacheProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
}

export default App;