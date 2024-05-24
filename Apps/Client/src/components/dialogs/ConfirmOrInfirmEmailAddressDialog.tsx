import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../hooks/useDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';

interface Props {

}

const ConfirmOrInfirmEmailAddressDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogAction } = useDialog();

    const isOpen = isDialogOpen(DialogName.ConfirmOrInfirmEmailAddress);
    const user = getDialogUser(DialogName.ConfirmOrInfirmEmailAddress);
    const action = getDialogAction(DialogName.ConfirmOrInfirmEmailAddress);
    const close = () => closeDialog(DialogName.ConfirmOrInfirmEmailAddress);

    const { confirmUserEmail, infirmUserEmail } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleConfirmOrInfirmUserEmail = async () => {
        if (user === null) return;

        close();

        (user.confirmed ? infirmUserEmail(user.email) : confirmUserEmail(user.email))
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