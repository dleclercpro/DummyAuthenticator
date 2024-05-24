import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../hooks/useDialog';
import { DialogName } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';

interface Props {

}

const BanUserDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogAction } = useDialog();

    const isOpen = isDialogOpen(DialogName.BanUser);
    const user = getDialogUser(DialogName.BanUser);
    const action = getDialogAction(DialogName.BanUser);
    const close = () => closeDialog(DialogName.BanUser);

    const { banUser, unbanUser } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleBanUser = async () => {
        if (user === null) return;

        close();

        (user.banned ? unbanUser(user.email) : banUser(user.email))
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