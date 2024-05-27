import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdropContext from '../../contexts/BackdropContext';
import useDialog from '../../hooks/useDialog';

const DIALOG_NAME = DialogName.BanUser;

interface Props {

}

const BanUserDialog: React.FC<Props> = (props) => {
    const dialog = useDialog(DIALOG_NAME);
    const user = dialog.user ? useUser(dialog.user.email) : null;
    
    const backdrop = useBackdropContext();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleBanUser = async () => {
        if (user === null || dialog.user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        dialog.close();

        dialog.beforeAction()
            .then(() => {
                if (dialog.user!.banned) {
                    return user.unban();
                }
                return user.ban();
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
                title={dialog.user ? `${dialog.user.banned ? 'Unban' : 'Ban'} user` : ''}
                text={dialog.user ? `Are you sure you want to ${dialog.user.banned ? 'unban' : 'ban'} user '${dialog.user.email}'?` : ''}
                handleYes={handleBanUser}
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

export default BanUserDialog;