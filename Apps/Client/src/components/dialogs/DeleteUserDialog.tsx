import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useBackdropContext from '../../contexts/BackdropContext';
import useDialog from '../../hooks/useDialog';
import useUser from '../../hooks/useUser';

const DIALOG_NAME = DialogName.DeleteUser;

interface Props {

}

const DeleteUserDialog: React.FC<Props> = (props) => {
    const dialog = useDialog(DIALOG_NAME);
    const user = useUser(dialog.user?.email ?? '')

    const backdrop = useBackdropContext();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleDeleteUser = async () => {
        if (user === null || dialog.user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        dialog.close();

        dialog.beforeAction()
            .then(() => user.delete())
            .then(() => dialog.afterAction())
            .catch((err) => {
                setSnackbarMessage(err.message);
                setSnackbarOpen(true);
            })
            .finally(() => {
                backdrop.hide();
            });
    }

    if (user === null || dialog.user === null) {
        return null;
    }

    return (
        <>
            <YesNoDialog
                open={dialog.isOpen}
                title='Delete account'
                text={`Are you sure you want to delete the account of user '${dialog.user.email}'? This cannot be undone!`}
                handleYes={handleDeleteUser}
                handleNo={dialog.close}
                handleClose={dialog.close}
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