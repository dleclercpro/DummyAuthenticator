import { useState } from 'react';
import useDatabase from '../../hooks/useDatabase';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../hooks/useDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';

interface Props {

}

const DeleteUserDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogAction } = useDialog();

    const isOpen = isDialogOpen(DialogName.DeleteUser);
    const user = getDialogUser(DialogName.DeleteUser);
    const action = getDialogAction(DialogName.DeleteUser);
    const close = () => closeDialog(DialogName.DeleteUser);

    const { deleteUser } = useDatabase();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleDeleteUser = async () => {
        if (user === null) return;

        setSnackbarOpen(false);

        close();

        return deleteUser(user.email)
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
                title='Delete account'
                text={`Are you sure you want to delete the account of user '${user.email}'? This cannot be undone!`}
                handleYes={handleDeleteUser}
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

export default DeleteUserDialog;