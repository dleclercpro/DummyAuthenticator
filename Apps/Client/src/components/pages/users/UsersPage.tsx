import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import useDatabase from '../../../hooks/useDatabase';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import LoadingButton from '../../buttons/LoadingButton';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useAuth from '../../../hooks/useAuth';
import { UserType } from '../../../constants';
import useUser from '../../../hooks/useUser';

interface Props {

}

const UsersPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();
    
    const [version, setVersion] = useState(0);
    const incrementVersion = () => setVersion(version + 1);

    const { userEmail, isAdmin } = useAuth();
    const { isEditingUser, demoteUserToRegular, promoteUserToAdmin } = useUser();
    
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

    const [isEditUserConfirmDialogOpen, setIsEditUserConfirmDialogOpen] = useState(false);
    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const openEditUserConfirmDialog = (email: string, type: UserType) => {
        setSelectedUserEmail(email);
        setSelectedUserType(type);
        setIsEditUserConfirmDialogOpen(true);
    }
    const closeEditUserConfirmDialog = () => {
        setSelectedUserEmail('');
        setSelectedUserType(null);
        setIsEditUserConfirmDialogOpen(false);
    }

    const openDeleteUserConfirmDialog = (email: string) => {
        setSelectedUserEmail(email);
        setIsDeleteUserConfirmDialogOpen(true);
    }
    const closeDeleteUserConfirmDialog = () => {
        setSelectedUserEmail('');
        setIsDeleteUserConfirmDialogOpen(false);
    }

    const handleEditUser = async () => {
        setIsEditUserConfirmDialogOpen(false);

        if (selectedUserType === UserType.Regular) {
            await promoteUserToAdmin(selectedUserEmail);
        } else {
            await demoteUserToRegular(selectedUserEmail);
        }

        incrementVersion();
    }

    const handleDeleteUser = async () => {
        setIsDeleteUserConfirmDialogOpen(false);

        await deleteUser(selectedUserEmail);

        incrementVersion();
    }

    const { users, isDeletingUser, deleteUser, getUsers } = useDatabase();

    useEffect(() => {
        getUsers();

    }, [version]);

    if (!users) {
        return null;
    }

    return (
        <>
            <YesNoDialog
                open={isEditUserConfirmDialogOpen}
                title={`${selectedUserType === UserType.Regular ? 'Promote' : 'Demote'} user`}
                text={`Are you sure you want to ${selectedUserType === UserType.Regular ? 'promote' : 'demote'} user '${selectedUserEmail}'?`}
                handleYes={handleEditUser}
                handleNo={closeEditUserConfirmDialog}
                handleClose={closeEditUserConfirmDialog}
            />
            <YesNoDialog
                open={isDeleteUserConfirmDialogOpen}
                title='Delete user'
                text={`Are you sure you want to delete user '${selectedUserEmail}'?`}
                handleYes={handleDeleteUser}
                handleNo={closeDeleteUserConfirmDialog}
                handleClose={closeDeleteUserConfirmDialog}
            />

            <Paper elevation={8} className={classes.root}>
                <div
                    className={`${classes.form} users`}
                >
                    <Typography variant='h1' className={classes.title}>
                        Users
                    </Typography>

                    <Typography className={classes.text}>
                        Here is the complete list of users:
                    </Typography>

                    <div className={`${classes.form} users`}>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th>
                                        <strong>E-mail</strong>
                                    </th>
                                    <th>
                                        <strong>Type</strong>
                                    </th>
                                    {isAdmin && (
                                        <th>
                                            <strong>Actions</strong>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {users.sort((a, b) => {
                                        if (a.type > b.type) return 1;
                                        if (a.type < b.type) return -1;
                                        return 0;
                                    }).map(({ type, email, confirmed }) => (
                                    <tr key={`admin-${email}`}>
                                        <td>
                                            <Typography>
                                                {email}
                                            </Typography>
                                        </td>
                                        <td>
                                            {type}
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <LoadingButton
                                                    className={classes.button}
                                                    variant='contained'
                                                    color={type === UserType.Regular ? 'primary' : 'secondary'}
                                                    icon={type === UserType.Regular ? <PromoteUserIcon /> : <DemoteUserIcon />}
                                                    loading={isEditingUser && email === selectedUserEmail}
                                                    disabled={email === userEmail || type === UserType.SuperAdmin}
                                                    onClick={() => openEditUserConfirmDialog(email, type)}
                                                >
                                                    {type === UserType.Regular ? 'Promote' : 'Demote'}
                                                </LoadingButton>
                                                <LoadingButton
                                                    className={classes.button}
                                                    variant='contained'
                                                    color='error'
                                                    icon={<DeleteIcon />}
                                                    loading={isDeletingUser && email === selectedUserEmail}
                                                    disabled={email === userEmail || type === UserType.SuperAdmin}
                                                    onClick={() => openDeleteUserConfirmDialog(email)}
                                                >
                                                    Delete
                                                </LoadingButton>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={classes.buttons}>
                    <div className='top'>
                        <Button
                            className={classes.linkButton}
                            component={Link}
                            to={getURL(Page.Home)}
                            color='secondary'
                            startIcon={<BackIcon />}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </Paper>
        </>
    );
}

export default UsersPage;