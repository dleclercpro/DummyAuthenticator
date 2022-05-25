import { colors, Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Severity } from "../types/CommonTypes";

const useSnackbarStyles = makeStyles()(({ palette, spacing }: Theme) => ({
    root: {

    },

    content: {
        backgroundColor: colors.common.black,
        color: colors.common.white,

        [`&.${Severity.Error}`]: {
            backgroundColor: palette.error.dark,
        },

        [`&.${Severity.Warning}`]: {
            backgroundColor: palette.warning.dark,
        },
    },

    message: {
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        marginRight: spacing(1),
    },
}));

export default useSnackbarStyles;