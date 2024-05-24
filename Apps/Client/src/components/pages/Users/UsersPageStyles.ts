import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { createPageStyles } from '../PageStyles';
import { createFormStyles } from '../../forms/FormStyles';
import { createTableStyles } from '../TableStyles';

const createUsersPageStyles = (theme: Theme): Record<string, CSSObject> => {
    const styles: Record<string, CSSObject> = {
        ...createPageStyles(theme),
        ...createFormStyles(theme),
        ...createTableStyles(theme),
    };

    return styles;
}

const useUsersPageStyles = makeStyles()(createUsersPageStyles);

export default useUsersPageStyles;