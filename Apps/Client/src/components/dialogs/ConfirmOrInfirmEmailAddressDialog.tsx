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
    const { isOpen, user, close, beforeAction, afterAction } = useDialog(DIALOG_NAME);

    const backdrop = useBackdropContext();

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