import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { SPACING } from '../../styles';

export const createTableStyles = (theme: Theme): Record<string, CSSObject> => {
    const { breakpoints, spacing } = theme;
    
    const styles: Record<string, CSSObject> = {
        tableContainer: {
            [breakpoints.up('lg')]: {
                maxHeight: 640,
                overflowY: 'auto',
            },
        },
    
        table: {
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
            marginBottom: spacing(SPACING),
    
            'th, td': {
                width: 'auto',
                textAlign: 'center',
                verticalAlign: 'middle',
                paddingTop: spacing(0.5),
                paddingBottom: spacing(0.5),
            },
    
            'thead th, tbody td': {
                borderTop: `1px solid grey`,
                borderBottom: `1px solid grey`,
            },
        },
    };

    return styles;
}

const useTableStyles = makeStyles()(createTableStyles);

export default useTableStyles;