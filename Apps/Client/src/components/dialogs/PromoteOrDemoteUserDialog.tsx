import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import { DialogName, UserType } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';
import useBackdropContext from '../../contexts/BackdropContext';
import useDialog from '../../hooks/useDialog';

const DIALOG_NAME = DialogName.PromoteOrDemoteUser;

interface Props {

}

const PromoteOrDemoteUserDialog: React.FC<Props> = (props) => {
    const dialog = useDialog(DIALOG_NAME);
    const user = dialog.user ? useUser(dialog.user.email) : null;

    const backdrop = useBackdropContext();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handlePromoteOrDemoteUser = async () => {
        if (user === null || dialog.user === null) return;

        setSnackbarOpen(false);

        backdrop.show();

        dialog.close();

        dialog.beforeAction()
            .then(() => {
                if (dialog.user!.type === UserType.Regular) {
                    return user.promoteToAdmin();
                }
                return user.demoteToRegular();
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
                title={dialog.user ? `${dialog.user.type === UserType.Regular ? 'Promote' : 'Demote'} user` : ''}
                text={dialog.user ? `Are you sure you want to ${dialog.user.type === UserType.Regular ? 'promote' : 'demote'} user '${dialog.user.email}'?` : ''}
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