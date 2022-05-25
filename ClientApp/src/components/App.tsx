import React from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createCache from '@emotion/cache';
import Login from './Login';
import Theme from '../styles/Theme';
import useAppStyles from './AppStyles';

export const Cache = createCache({ key: 'mui', prepend: true });

interface Props {

}

const App: React.FC<Props> = () => {
    const { classes } = useAppStyles();
    
    return (
        <CacheProvider value={Cache}>
            <ThemeProvider theme={Theme}>
                <CssBaseline />
                
                <div className={classes.root}>
                    <Login />
                </div>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;