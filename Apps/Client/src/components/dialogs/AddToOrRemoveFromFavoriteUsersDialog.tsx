import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../contexts/DialogContext';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdrop from '../../contexts/BackdropContext';

const DIALOG_NAME = DialogName.AddToOrRemoveFromFavoriteUsers;

interface Props {

}

const AddToOrRemoveFromFavoriteUsersDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogBeforeAction, getDialogAfterAction } = useDialog();

    const backdrop = useBackdrop();

    const isOpen = isDialogOpen(DIALOG_NAME);
    const user = getDialogUser(DIALOG_NAME);
    const close = () => closeDialog(DIALOG_NAME);
    const beforeAction = getDialogBeforeAction(DIALOG_NAME);
    const afterAction = getDialogAfterAction(DIALOG_NAME);

    const { addUserToFavorites, removeUserFromFavorites } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleAddToOrRemoveFromFavoriteUsers = async () => {
        if (user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        close();

        beforeAction()
            .then(() => {
                if (user.favorited) {
                    return removeUserFromFavorites(user.email);
                }
                return addUserToFavorites(user.email);
            })
            .then(() => afterAction())
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                backdrop.hide();
            });
    }

    if (user === null) {
        return null;
    }

    return (
        <>
            <YesNoDialog
                open={isOpen}
                title={user ? (user.favorited ? 'Remove user from favorite' : 'Add user to favorites') : ''}
                text={user ? `Are you sure you want to ${user.favorited ? 'remove' : 'add'} user '${user.email}' ${user.favorited ? 'from' : 'to'} your favorites?` : ''}
                handleYes={handleAddToOrRemoveFromFavoriteUsers}
                handleNo={close}
                handleClose={close}
            />
            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={Severity.Error}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
}

export default AddToOrRemoveFromFavoriteUsersDialog;