import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';

export const createPageStyles = ({ palette, breakpoints, spacing }: Theme): Record<string, CSSObject> => ({
    root: {
        width: '100%',
        maxWidth: 720,
        padding: spacing(2),

        [breakpoints.up('sm')]: {
            padding: spacing(3),
        },
    },
});

const usePageStyles = makeStyles()(createPageStyles);

export default usePageStyles;