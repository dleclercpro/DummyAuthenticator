import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { AuthContextProvider } from './contexts/AuthContext';
import { StylesCache } from './styles';
import { getAppTheme } from './styles/Theme';
import './index.css';
import { DialogContextProvider } from './contexts/DialogContext';
import { BackdropContextProvider } from './contexts/BackdropContext';

// Render DOM
ReactDOM
    .createRoot(document.getElementById('root') as HTMLElement)
    .render(
        <BrowserRouter>
            <AuthContextProvider>
                <CacheProvider value={StylesCache}>
                    <ThemeProvider theme={getAppTheme()}>
                        <CssBaseline />
                        
                        <BackdropContextProvider>
                            <DialogContextProvider>
                                <App />
                            </DialogContextProvider>
                        </BackdropContextProvider>
                    </ThemeProvider>
                </CacheProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );