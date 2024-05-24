import { makeStyles } from 'tss-react/mui';
import { SPACING } from '../styles';
import { Theme } from '@mui/material';

const useAppStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
        padding: spacing(SPACING),
    },
    spinnerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    icon: {
        width: spacing(6),
        height: spacing(6),
        marginRight: spacing(SPACING),
    },
    spinner: {
        '&:not(:last-child)': {
            marginBottom: spacing(SPACING),
        },
    },
    status: {
        display: 'flex',
        alignItems: 'center',
    },
    statusIcon: {

    },
    version: {
        fontWeight: 'bold',
        marginLeft: spacing(SPACING / 2),
    },
}));

export default useAppStyles;