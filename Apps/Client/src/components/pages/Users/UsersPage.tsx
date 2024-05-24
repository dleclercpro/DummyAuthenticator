import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useDatabase from '../../../hooks/useDatabase';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmEmailIcon from '@mui/icons-material/MarkEmailReadOutlined';
import UnconfirmEmailIcon from '@mui/icons-material/MailLockOutlined';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveFavoriteIcon from '@mui/icons-material/StarBorder';
import AddFavoriteIcon from '@mui/icons-material/Star';
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
import useUsersPageStyles from './UsersPageStyles';
import UserActionButton from '../../buttons/UserActionButton';

interface Props {

}

const UsersPage: React.FC<Props> = () => {
    const { classes } = useUsersPageStyles();

    const backdrop = useBackdrop();

    const [version, setVersion] = useState(0);
    const incrementVersion = () => setVersion(version + 1);

    const { userEmail, isAdmin, isSuperAdmin } = useAuth();
    const { isEditingUser, banUser, unbanUser, addUserToFavorites, removeUserFromFavorites, unconfirmUserEmail, confirmUserEmail, demoteUserToRegular, promoteUserToAdmin } = useUser();
    const { users, isDeletingUser, getUsers, deleteUser } = useDatabase();
    
    const [selectedUser, setSelectedUser] = useState<UserJSON | null>(null);

    const [isPromoteUserConfirmDialogOpen, setIsPromoteUserConfirmDialogOpen] = useState(false);
    const [isFavoriteUserConfirmDialogOpen, setIsFavoriteUserConfirmDialogOpen] = useState(false);
    const [isBanUserConfirmDialogOpen, setIsBanUserConfirmDialogOpen] = useState(false);
    const [isUnconfirmUserEmailConfirmDialogOpen, setIsUnconfirmUserEmailConfirmDialogOpen] = useState(false);
    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const isLoading = isEditingUser || isDeletingUser;



    const openPromoteUserConfirmDialog = (user: UserJSON) => {
        setSelectedUser(user);
        setIsPromoteUserConfirmDialogOpen(true);
    }
    const closePromoteUserConfirmDialog = () => {
        setSelectedUser(null);
        setIsPromoteUserConfirmDialogOpen(false);
    }

    const openFavoriteUserConfirmDialog = (user: UserJSON) => {
        setSelectedUser(user);
        setIsFavoriteUserConfirmDialogOpen(true);
    }
    const closeFavoriteUserConfirmDialog = () => {
        setSelectedUser(null);
        setIsFavoriteUserConfirmDialogOpen(false);
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



    const handlePromoteUser = async () => {
        if (selectedUser === null) return;

        setIsPromoteUserConfirmDialogOpen(false);

        if (selectedUser.type === UserType.Regular) {
            await promoteUserToAdmin(selectedUser.email);
        } else {
            await demoteUserToRegular(selectedUser.email);
        }

        incrementVersion();
    }

    const handleFavoriteUser = async () => {
        if (selectedUser === null) return;

        setIsFavoriteUserConfirmDialogOpen(false);

        if (!selectedUser.favorited) {
            await addUserToFavorites(selectedUser.email);
        } else {
            await removeUserFromFavorites(selectedUser.email);
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

        if (selectedUser.confirmed) {
            await unconfirmUserEmail(selectedUser.email);
        } else {
            await confirmUserEmail(selectedUser.email);
        }

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
                open={isPromoteUserConfirmDialogOpen}
                title={selectedUser ? `${selectedUser.type === UserType.Regular ? 'Promote' : 'Demote'} user` : ''}
                text={selectedUser ? `Are you sure you want to ${selectedUser.type === UserType.Regular ? 'promote' : 'demote'} user '${selectedUser.email}'?` : ''}
                handleYes={handlePromoteUser}
                handleNo={closePromoteUserConfirmDialog}
                handleClose={closePromoteUserConfirmDialog}
            />
            <YesNoDialog
                open={isFavoriteUserConfirmDialogOpen}
                title={selectedUser ? (selectedUser.favorited ? 'Remove user from favorite' : 'Add user to favorites') : ''}
                text={selectedUser ? `Are you sure you want to ${selectedUser.favorited ? 'remove' : 'add'} user '${selectedUser.email}' ${selectedUser.favorited ? 'from' : 'to'} your favorites?` : ''}
                handleYes={handleFavoriteUser}
                handleNo={closeFavoriteUserConfirmDialog}
                handleClose={closeFavoriteUserConfirmDialog}
            />
            <YesNoDialog
                open={isUnconfirmUserEmailConfirmDialogOpen}
                title={selectedUser ? `${selectedUser.confirmed ? 'Unconfirm' : 'Confirm'} e-mail` : ''}
                text={selectedUser ? `Are you sure you want to ${selectedUser.confirmed ? 'unconfirm' : 'confirm'} the e-mail address of user '${selectedUser.email}'?` : ''}
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
                                                        <UserActionButton
                                                            user={user}
                                                            isSelf={user.email === userEmail}
                                                            selfText={`${user.type === UserType.Regular ? 'Promote' : 'Demote'} yourself`}
                                                            text={user.type === UserType.Regular ? 'Promote regular user to admin' : 'Demote admin to regular user'}
                                                            color={user.type === UserType.Regular ? 'primary' : 'secondary'}
                                                            disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                            onClick={() => openPromoteUserConfirmDialog(user)}
                                                        >
                                                            {user.type === UserType.Regular ? <PromoteUserIcon /> : <DemoteUserIcon />}
                                                        </UserActionButton>

                                                        <UserActionButton
                                                            user={user}
                                                            isSelf={user.email === userEmail}
                                                            selfText='You cannot remove your e-mail confirmation'
                                                            text={user.confirmed ? `Unconfirm user's e-mail address` : `Confirm user's e-mail address`}
                                                            color={user.confirmed ? 'error' : 'success'}
                                                            disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                            onClick={() => openUnconfirmUserEmailConfirmDialog(user)}
                                                        >
                                                            {user.confirmed ? <UnconfirmEmailIcon /> : <ConfirmEmailIcon />}
                                                        </UserActionButton>

                                                        <UserActionButton
                                                            user={user}
                                                            isSelf={user.email === userEmail}
                                                            selfText='You cannot add yourself to your favorites'
                                                            text={user.favorited ? 'Remove user from favorites' : 'Add user to favorites'}
                                                            color={user.banned ? 'success' : 'error'}
                                                            disabled={user.email === userEmail}
                                                            onClick={() => openFavoriteUserConfirmDialog(user)}
                                                        >
                                                            {user.email === userEmail && (
                                                                <AddFavoriteIcon />
                                                            )}
                                                            {user.email !== userEmail && (
                                                                user.favorited ? (
                                                                    <RemoveFavoriteIcon color='warning' />
                                                                ) : (
                                                                    <AddFavoriteIcon color='warning' />
                                                                )
                                                            )}
                                                        </UserActionButton>

                                                        <UserActionButton
                                                            user={user}
                                                            isSelf={user.email === userEmail}
                                                            selfText='You cannot ban yourself'
                                                            text={user.banned ? 'Unban user' : 'Ban user'}
                                                            color={user.banned ? 'success' : 'error'}
                                                            disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                            onClick={() => openBanUserConfirmDialog(user)}
                                                        >
                                                            {user.banned ? <UnbanUserIcon /> : <BanUserIcon />}
                                                        </UserActionButton>

                                                        <UserActionButton
                                                            user={user}
                                                            isSelf={user.email === userEmail}
                                                            selfText='Delete your account'
                                                            text='Delete user'
                                                            color='error'
                                                            disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                            onClick={() => openDeleteUserConfirmDialog(user)}
                                                        >
                                                            <DeleteIcon />
                                                        </UserActionButton>
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