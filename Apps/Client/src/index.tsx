import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { AuthContextProvider } from './hooks/useAuth';
import { BackdropContextProvider } from './hooks/useBackdrop';
import { StylesCache } from './styles';
import { getAppTheme } from './styles/Theme';
import './index.css';
import { DialogContextProvider } from './hooks/useDialog';

// Render DOM
ReactDOM
    .createRoot(document.getElementById('root') as HTMLElement)
    .render(
        <BrowserRouter>
            <AuthContextProvider>
                <CacheProvider value={StylesCache}>
                    <ThemeProvider theme={getAppTheme()}>
                        <CssBaseline />
                        
                        <DialogContextProvider>
                            <BackdropContextProvider>
                                <App />
                            </BackdropContextProvider>
                        </DialogContextProvider>
                    </ThemeProvider>
                </CacheProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );