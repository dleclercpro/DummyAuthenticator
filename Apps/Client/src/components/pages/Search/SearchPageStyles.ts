import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { createPageStyles } from '../PageStyles';
import { createFormStyles } from '../../forms/FormStyles';
import { createTableStyles } from '../TableStyles';

const createSearchPageStyles = (theme: Theme): Record<string, CSSObject> => {
    const styles: Record<string, CSSObject> = {
        ...createPageStyles(theme),
        ...createFormStyles(theme),
        ...createTableStyles(theme),

        iconStar: {
  
        },
    };

    return styles;
}

const useSearchPageStyles = makeStyles()(createSearchPageStyles);

export default useSearchPageStyles;