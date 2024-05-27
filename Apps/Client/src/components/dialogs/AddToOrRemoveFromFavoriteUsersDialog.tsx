import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdropContext from '../../contexts/BackdropContext';
import useDialog from '../../hooks/useDialog';

const DIALOG_NAME = DialogName.AddToOrRemoveFromFavoriteUsers;

interface Props {

}

const AddToOrRemoveFromFavoriteUsersDialog: React.FC<Props> = (props) => {
    const { isOpen, user, close, beforeAction, afterAction } = useDialog(DIALOG_NAME);

    const backdrop = useBackdropContext();

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