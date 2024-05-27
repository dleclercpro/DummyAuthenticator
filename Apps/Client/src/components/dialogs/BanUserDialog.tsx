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
    const { isOpen, user, close, beforeAction, afterAction } = useDialog(DIALOG_NAME);
    
    const backdrop = useBackdropContext();

    const { banUser, unbanUser } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleBanUser = async () => {
        if (user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        close();

        beforeAction()
            .then(() => {
                if (user.banned) {
                    return unbanUser(user.email);
                }
                return banUser(user.email);
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
                title={user ? `${user.banned ? 'Unban' : 'Ban'} user` : ''}
                text={user ? `Are you sure you want to ${user.banned ? 'unban' : 'ban'} user '${user.email}'?` : ''}
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