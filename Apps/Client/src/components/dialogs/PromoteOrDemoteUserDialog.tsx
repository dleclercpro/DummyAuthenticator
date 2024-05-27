import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../contexts/DialogContext';
import { DialogName, UserType } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdrop from '../../contexts/BackdropContext';

const DIALOG_NAME = DialogName.PromoteOrDemoteUser;

interface Props {

}

const PromoteOrDemoteUserDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogBeforeAction, getDialogAfterAction } = useDialog();

    const backdrop = useBackdrop();

    const isOpen = isDialogOpen(DIALOG_NAME);
    const user = getDialogUser(DIALOG_NAME);
    const close = () => closeDialog(DIALOG_NAME);
    const beforeAction = getDialogBeforeAction(DIALOG_NAME);
    const afterAction = getDialogAfterAction(DIALOG_NAME);

    const { promoteUserToAdmin, demoteUserToRegular } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handlePromoteOrDemoteUser = async () => {
        if (user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        close();

        beforeAction()
            .then(() => {
                if (user.type === UserType.Regular) {
                    return promoteUserToAdmin(user.email);
                }
                return demoteUserToRegular(user.email);
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
                title={user ? `${user.type === UserType.Regular ? 'Promote' : 'Demote'} user` : ''}
                text={user ? `Are you sure you want to ${user.type === UserType.Regular ? 'promote' : 'demote'} user '${user.email}'?` : ''}
                handleYes={handlePromoteOrDemoteUser}
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

export default PromoteOrDemoteUserDialog;