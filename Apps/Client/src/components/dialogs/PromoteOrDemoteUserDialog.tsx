import { useState } from 'react';
import YesNoDialog from './YesNoDialog';
import useDialog from '../../hooks/useDialog';
import { DialogName, UserType } from '../../constants';
import Snackbar from '../Snackbar';
import { Severity } from '../../types/CommonTypes';
import useUser from '../../hooks/useUser';

interface Props {

}

const PromoteOrDemoteUserDialog: React.FC<Props> = (props) => {
    const { isDialogOpen, closeDialog, getDialogUser, getDialogAction } = useDialog();

    const isOpen = isDialogOpen(DialogName.PromoteOrDemoteUser);
    const user = getDialogUser(DialogName.PromoteOrDemoteUser);
    const action = getDialogAction(DialogName.PromoteOrDemoteUser);
    const close = () => closeDialog(DialogName.PromoteOrDemoteUser);

    const { promoteUserToAdmin, demoteUserToRegular } = useUser();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handlePromoteOrDemoteUser = async () => {
        if (user === null) return;

        close();

        (user.type === UserType.Regular ? promoteUserToAdmin(user.email) : demoteUserToRegular(user.email))
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