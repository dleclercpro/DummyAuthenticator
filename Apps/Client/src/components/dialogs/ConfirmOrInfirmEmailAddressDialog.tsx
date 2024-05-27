import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdropContext from '../../contexts/BackdropContext';
import useDialog from '../../hooks/useDialog';

const DIALOG_NAME = DialogName.ConfirmOrInfirmEmailAddress;

interface Props {

}

const ConfirmOrInfirmEmailAddressDialog: React.FC<Props> = (props) => {
    const dialog = useDialog(DIALOG_NAME);
    const user = useUser(dialog.user?.email ?? '')

    const backdrop = useBackdropContext();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleConfirmOrInfirmUserEmail = async () => {
        if (user === null || dialog.user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        dialog.close();

        dialog.beforeAction()
            .then(() => {
                if (dialog.user!.confirmed) {
                    return user.infirmEmail();
                }
                return user.confirmEmail();
            })
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
                title={dialog.user ? `${dialog.user.confirmed ? 'Unconfirm' : 'Confirm'} e-mail` : ''}
                text={dialog.user ? `Are you sure you want to ${dialog.user.confirmed ? 'unconfirm' : 'confirm'} the e-mail address of user '${dialog.user.email}'?` : ''}
                handleYes={handleConfirmOrInfirmUserEmail}
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

export default ConfirmOrInfirmEmailAddressDialog;