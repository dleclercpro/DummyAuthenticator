import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { createPageStyles } from '../PageStyles';
import { createFormStyles } from '../../forms/FormStyles';

const createSignUpPageStyles = (theme: Theme): Record<string, CSSObject> => {
    const styles: Record<string, CSSObject> = {
        ...createPageStyles(theme),
        ...createFormStyles(theme),
    };

    return styles;
}

const useSignUpPageStyles = makeStyles()(createSignUpPageStyles);

export default useSignUpPageStyles;