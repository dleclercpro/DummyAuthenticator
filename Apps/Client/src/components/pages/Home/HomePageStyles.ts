import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { createDashboardStyles } from '../DashboardStyles';

const createHomePageStyles = (theme: Theme): Record<string, CSSObject> => {
    const styles: Record<string, CSSObject> = {
        ...createDashboardStyles(theme),
    };

    return styles;
}

const useHomePageStyles = makeStyles()(createHomePageStyles);

export default useHomePageStyles;