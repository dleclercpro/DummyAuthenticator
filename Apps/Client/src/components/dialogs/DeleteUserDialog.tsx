import { useState } from 'react';
import useDatabase from '../../hooks/useDatabase';
import YesNoDialog from './YesNoDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useBackdropContext from '../../contexts/BackdropContext';
import useDialog from '../../hooks/useDialog';

const DIALOG_NAME = DialogName.DeleteUser;

interface Props {

}

const DeleteUserDialog: React.FC<Props> = (props) => {
    const { isOpen, user, close, beforeAction, afterAction } = useDialog(DIALOG_NAME);

    const backdrop = useBackdropContext();

    const { deleteUser } = useDatabase();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleDeleteUser = async () => {
        if (user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        close();

        beforeAction()
            .then(() => deleteUser(user.email))
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