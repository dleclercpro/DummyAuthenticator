import { Theme } from '@mui/material';
import { CSSObject } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { createPageStyles } from '../PageStyles';
import { createFormStyles } from '../../forms/FormStyles';
import { BUTTON_HEIGHT } from '../../../styles';

const createSignInPageStyles = (theme: Theme): Record<string, CSSObject> => {
    const { spacing } = theme;

    const styles: Record<string, CSSObject> = {
        ...createPageStyles(theme),
        ...createFormStyles(theme),

        staySignedInSwitch: {
            marginTop: spacing(-0.5),
        },

        switchButton: {
            height: spacing(BUTTON_HEIGHT),
            marginBottom: spacing(0.5),
        },
    };

    return styles;
}

const useSignInPageStyles = makeStyles()(createSignInPageStyles);

export default useSignInPageStyles;