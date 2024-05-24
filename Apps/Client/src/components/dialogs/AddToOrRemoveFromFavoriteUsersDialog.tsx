import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../hooks/useDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';

interface Props {

}

const AddToOrRemoveFromFavoriteUsersDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogAction } = useDialog();

    const isOpen = isDialogOpen(DialogName.AddToOrRemoveFromFavoriteUsers);
    const user = getDialogUser(DialogName.AddToOrRemoveFromFavoriteUsers);
    const action = getDialogAction(DialogName.AddToOrRemoveFromFavoriteUsers);
    const close = () => closeDialog(DialogName.AddToOrRemoveFromFavoriteUsers);

    const { addUserToFavorites, removeUserFromFavorites } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleAddToOrRemoveFromFavoriteUsers = async () => {
        if (user === null) return;

        close();

        (user.favorited ? removeUserFromFavorites(user.email) : addUserToFavorites(user.email))
            .then(() => {                
                if (action) {
                    return action();
                }
            })
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
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