import { Button, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import useDatabase from '../../../hooks/useDatabase';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/MailLockOutlined';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import BanUserIcon from '@mui/icons-material/Cancel';
import UnbanUserIcon from '@mui/icons-material/Check';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useAuth from '../../../hooks/useAuth';
import { UserType } from '../../../constants';
import useUser from '../../../hooks/useUser';
import { UserJSON } from '../../../types/JSONTypes';
import { createCompareFunction } from '../../../utils/comparison';
import UserComparators from '../../../models/comparators/UserComparators';
import useBackdrop from '../../../hooks/useBackdrop';

interface Props {

}

const UsersPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();

    const backdrop = useBackdrop();

    const [version, setVersion] = useState(0);
    const incrementVersion = () => setVersion(version + 1);

    const { userEmail, isAdmin, isSuperAdmin } = useAuth();
    const { isEditingUser, isUnconfirmingUserEmail, banUser, unbanUser, unconfirmUserEmail, demoteUserToRegular, promoteUserToAdmin } = useUser();
    const { users, isDeletingUser, getUsers, deleteUser } = useDatabase();
    
    const [selectedUser, setSelectedUser] = useState<UserJSON | null>(null);

    const [isEditUserConfirmDialogOpen, setIsEditUserConfirmDialogOpen] = useState(false);
    const [isBanUserConfirmDialogOpen, setIsBanUserConfirmDialogOpen] = useState(false);
    const [isUnconfirmUserEmailConfirmDialogOpen, setIsUnconfirmUserEmailConfirmDialogOpen] = useState(false);
    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const isLoading = isEditingUser || isDeletingUser || isUnconfirmingUserEmail;



    const openEditUserConfirmDialog = (user: UserJSON) => {
        setSelectedUser(user);
        setIsEditUserConfirmDialogOpen(true);
    }
    const closeEditUserConfirmDialog = () => {
        setSelectedUser(null);
        setIsEditUserConfirmDialogOpen(false);
    }

    const openBanUserConfirmDialog = (user: UserJSON) => {
        setSelectedUser(user);
        setIsBanUserConfirmDialogOpen(true);
    }
    const closeBanUserConfirmDialog = () => {
        setSelectedUser(null);
        setIsBanUserConfirmDialogOpen(false);
    }

    const openUnconfirmUserEmailConfirmDialog = (user: UserJSON) => {
        setSelectedUser(user);
        setIsUnconfirmUserEmailConfirmDialogOpen(true);
    }
    const closeUnconfirmUserEmailConfirmDialog = () => {
        setSelectedUser(null);
        setIsUnconfirmUserEmailConfirmDialogOpen(false);
    }

    const openDeleteUserConfirmDialog = (user: UserJSON) => {
        setSelectedUser(user);
        setIsDeleteUserConfirmDialogOpen(true);
    }
    const closeDeleteUserConfirmDialog = () => {
        setSelectedUser(null);
        setIsDeleteUserConfirmDialogOpen(false);
    }



    const handleEditUser = async () => {
        if (selectedUser === null) return;

        setIsEditUserConfirmDialogOpen(false);

        if (selectedUser.type === UserType.Regular) {
            await promoteUserToAdmin(selectedUser.email);
        } else {
            await demoteUserToRegular(selectedUser.email);
        }

        incrementVersion();
    }
    
    const handleBanUser = async () => {
        if (selectedUser === null) return;

        setIsBanUserConfirmDialogOpen(false);

        if (selectedUser.banned) {
            await unbanUser(selectedUser.email);
        } else {
            await banUser(selectedUser.email);
        }

        incrementVersion();
    }

    const handleUnconfirmUserEmail = async () => {
        if (selectedUser === null) return;

        setIsUnconfirmUserEmailConfirmDialogOpen(false);

        await unconfirmUserEmail(selectedUser.email);

        incrementVersion();
    }

    const handleDeleteUser = async () => {
        if (selectedUser === null) return;

        setIsDeleteUserConfirmDialogOpen(false);

        await deleteUser(selectedUser.email);

        incrementVersion();
    }



    // Reload users whenever something changed
    useEffect(() => {
        getUsers();

    }, [version]);

    // Show loading backdrop when calls are being executed
    useEffect(() => {
        if (!backdrop.isVisible && isLoading) {
            backdrop.show();
        }
        if (backdrop.isVisible && !isLoading) {
            backdrop.hide();
        }

    }, [isLoading]);



    if (!users) {
        return null;
    }

    return (
        <>
            <YesNoDialog
                open={isBanUserConfirmDialogOpen}
                title={selectedUser ? `${selectedUser.banned ? 'Unban' : 'Ban'} user` : ''}
                text={selectedUser ? `Are you sure you want to ${selectedUser.banned ? 'unban' : 'ban'} user '${selectedUser.email}'?` : ''}
                handleYes={handleBanUser}
                handleNo={closeBanUserConfirmDialog}
                handleClose={closeBanUserConfirmDialog}
            />
            <YesNoDialog
                open={isEditUserConfirmDialogOpen}
                title={selectedUser ? `${selectedUser.type === UserType.Regular ? 'Promote' : 'Demote'} user` : ''}
                text={selectedUser ? `Are you sure you want to ${selectedUser.type === UserType.Regular ? 'promote' : 'demote'} user '${selectedUser.email}'?` : ''}
                handleYes={handleEditUser}
                handleNo={closeEditUserConfirmDialog}
                handleClose={closeEditUserConfirmDialog}
            />
            <YesNoDialog
                open={isUnconfirmUserEmailConfirmDialogOpen}
                title={`Unconfirm e-mail`}
                text={selectedUser ? `Are you sure you want to unconfirm e-mail address of user '${selectedUser.email}'?` : ''}
                handleYes={handleUnconfirmUserEmail}
                handleNo={closeUnconfirmUserEmailConfirmDialog}
                handleClose={closeUnconfirmUserEmailConfirmDialog}
            />
            <YesNoDialog
                open={isDeleteUserConfirmDialogOpen}
                title='Delete user'
                text={selectedUser ? `Are you sure you want to delete user '${selectedUser.email}'?` : ''}
                handleYes={handleDeleteUser}
                handleNo={closeDeleteUserConfirmDialog}
                handleClose={closeDeleteUserConfirmDialog}
            />

            <Paper elevation={8} className={classes.root}>
                <div className={`${classes.form} users`}>
                    <Typography variant='h1' className={classes.title}>
                        Users
                    </Typography>

                    <Typography className={classes.text}>
                        Here is the complete list of users:
                    </Typography>

                    <div className={`${classes.form} users`}>
                        <div className={classes.tableContainer}>
                            <table className={classes.table}>
                                <thead>
                                    <tr>
                                        <th>
                                            <strong>E-mail</strong>
                                        </th>
                                        <th>
                                            <strong>Type</strong>
                                        </th>
                                        {(isAdmin || isSuperAdmin) && (
                                            <th>
                                                <strong>Actions</strong>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users
                                        .sort(createCompareFunction<UserJSON>([
                                            (a, b) => UserComparators.compareType(a.type, b.type, true),
                                            (a, b) => UserComparators.compareEmail(a.email, b.email)
                                        ]))
                                        .map((user) => (
                                            <tr key={`admin-${user.email}`}>
                                                <td>
                                                    <Typography>
                                                        {user.email}
                                                    </Typography>
                                                </td>
                                                <td>
                                                    {user.type}
                                                </td>
                                                {(isAdmin || isSuperAdmin) && (
                                                    <td>
                                                        <Tooltip title={user.type === UserType.Regular ? 'Promote user to admin role' : 'Demote admin to regular user'}>
                                                            <IconButton
                                                                color={user.type === UserType.Regular ? 'primary' : 'secondary'}
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                                onClick={() => openEditUserConfirmDialog(user)}
                                                            >
                                                                {user.type === UserType.Regular ? <PromoteUserIcon /> : <DemoteUserIcon />}
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title='Unconfirm user e-mail address'>
                                                            <IconButton
                                                                color='secondary'
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin || !user.confirmed}
                                                                onClick={() => openUnconfirmUserEmailConfirmDialog(user)}
                                                            >
                                                                <EmailIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title={user.banned ? 'Unban user' : 'Ban user'}>
                                                            <IconButton
                                                                color={user.banned ? 'success' : 'error'}
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                                onClick={() => openBanUserConfirmDialog(user)}
                                                            >
                                                                {user.banned ? <UnbanUserIcon /> : <BanUserIcon />}
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title='Delete user'>
                                                            <IconButton
                                                                color='error'
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                                onClick={() => openDeleteUserConfirmDialog(user)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
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