import { makeStyles } from 'tss-react/mui';

const useAppStyles = makeStyles()(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
    },
}));

export default useAppStyles;