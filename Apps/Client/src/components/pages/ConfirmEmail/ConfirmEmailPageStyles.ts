import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { createPageStyles } from '../PageStyles';
import { SPACING } from '../../../styles';
import { createFormStyles } from '../../forms/FormStyles';

const createConfirmEmailPageStyles = (theme: Theme): Record<string, CSSObject> => {
    const { spacing } = theme;
    
    const styles: Record<string, CSSObject> = {
        ...createPageStyles(theme),
        ...createFormStyles(theme),

        icon: {
            width: spacing(6),
            height: spacing(6),
            marginRight: spacing(SPACING),
        },
    };

    return styles;
}

const useTokenPageStyles = makeStyles()(createConfirmEmailPageStyles);

export default useTokenPageStyles;