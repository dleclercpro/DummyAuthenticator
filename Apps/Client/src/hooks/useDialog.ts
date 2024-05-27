import { DialogName } from '../constants';
import useDialogContext from '../contexts/DialogContext';
import { UserJSON } from '../types/JSONTypes';

const useDialog = (dialogName: DialogName) => {
    const { isDialogOpen, openDialog, closeDialog, toggleDialog, getDialogUser, setDialogUser, getDialogBeforeAction, getDialogAfterAction, setDialogBeforeAction, setDialogAfterAction } = useDialogContext();

    return {
        isOpen: isDialogOpen(dialogName),
        open: () => openDialog(dialogName),
        close: () => closeDialog(dialogName),
        toggle: () => toggleDialog(dialogName),
        user: getDialogUser(dialogName),
        setUser: (user: UserJSON) => setDialogUser(dialogName, user),
        beforeAction: getDialogBeforeAction(dialogName),
        afterAction: getDialogAfterAction(dialogName),
        setBeforeAction: (action: () => Promise<void>) => setDialogBeforeAction(dialogName, action),
        setAfterAction: (action: () => Promise<void>) => setDialogAfterAction(dialogName, action),
    };
}

export default useDialog;