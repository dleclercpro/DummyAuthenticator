import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialogContext from '../../contexts/DialogContext';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdropContext from '../../contexts/BackdropContext';

const DIALOG_NAME = DialogName.ConfirmOrInfirmEmailAddress;

interface Props {

}

const ConfirmOrInfirmEmailAddressDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogBeforeAction, getDialogAfterAction } = useDialogContext();

    const backdrop = useBackdropContext();

    const isOpen = isDialogOpen(DIALOG_NAME);
    const user = getDialogUser(DIALOG_NAME);
    const close = () => closeDialog(DIALOG_NAME);
    const beforeAction = getDialogBeforeAction(DIALOG_NAME);
    const afterAction = getDialogAfterAction(DIALOG_NAME);

    const { confirmUserEmail, infirmUserEmail } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleConfirmOrInfirmUserEmail = async () => {
        if (user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        close();

        beforeAction()
            .then(() => {
                if (user.confirmed) {
                    return infirmUserEmail(user.email);
                }
                return confirmUserEmail(user.email);
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
                title={user ? `${user.confirmed ? 'Unconfirm' : 'Confirm'} e-mail` : ''}
                text={user ? `Are you sure you want to ${user.confirmed ? 'unconfirm' : 'confirm'} the e-mail address of user '${user.email}'?` : ''}
                handleYes={handleConfirmOrInfirmUserEmail}
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

export default ConfirmOrInfirmEmailAddressDialog;