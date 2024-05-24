import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import useDatabase from '../../../hooks/useDatabase';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import BanUserIcon from '@mui/icons-material/Cancel';
import UnbanUserIcon from '@mui/icons-material/Check';
import LoadingButton from '../../buttons/LoadingButton';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useAuth from '../../../hooks/useAuth';
import { UserType } from '../../../constants';
import useUser from '../../../hooks/useUser';
import UserTypeComparator from '../../../models/UserTypeComparator';

interface Props {

}

const UsersPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();
    
    const [version, setVersion] = useState(0);
    const incrementVersion = () => setVersion(version + 1);

    const { userEmail, isAdmin } = useAuth();
    const { isEditingUser, isUnconfirmingUserEmail, banUser, unbanUser, unconfirmUserEmail, demoteUserToRegular, promoteUserToAdmin } = useUser();
    
    const [selectedUserEmail, setSelectedUserEmail] = useState('');
    const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
    const [selectedUserBan, setSelectedUserBan] = useState(false);

    const [isEditUserConfirmDialogOpen, setIsEditUserConfirmDialogOpen] = useState(false);
    const [isBanUserConfirmDialogOpen, setIsBanUserConfirmDialogOpen] = useState(false);
    const [isUnconfirmUserEmailConfirmDialogOpen, setIsUnconfirmUserEmailConfirmDialogOpen] = useState(false);
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

    const openBanUserConfirmDialog = (email: string, type: UserType) => {
        setSelectedUserEmail(email);
        setSelectedUserType(type);
        setIsBanUserConfirmDialogOpen(true);
    }
    const closeBanUserConfirmDialog = () => {
        setSelectedUserEmail('');
        setSelectedUserType(null);
        setIsBanUserConfirmDialogOpen(false);
    }

    const openUnconfirmUserEmailConfirmDialog = (email: string, type: UserType) => {
        setSelectedUserEmail(email);
        setSelectedUserType(type);
        setIsUnconfirmUserEmailConfirmDialogOpen(true);
    }
    const closeUnconfirmUserEmailConfirmDialog = () => {
        setSelectedUserEmail('');
        setSelectedUserType(null);
        setIsUnconfirmUserEmailConfirmDialogOpen(false);
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
    
    const handleBanUser = async () => {
        setIsBanUserConfirmDialogOpen(false);

        if (selectedUserBan) {
            await unbanUser(selectedUserEmail);
        } else {
            await banUser(selectedUserEmail);
        }

        incrementVersion();
    }

    const handleUnconfirmUserEmail = async () => {
        setIsUnconfirmUserEmailConfirmDialogOpen(false);

        await unconfirmUserEmail(selectedUserEmail);

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
                open={isBanUserConfirmDialogOpen}
                title={`${selectedUserBan ? 'Unban' : 'Ban'} user`}
                text={`Are you sure you want to ${selectedUserBan ? 'unban' : 'ban'} user '${selectedUserEmail}'?`}
                handleYes={handleBanUser}
                handleNo={closeBanUserConfirmDialog}
                handleClose={closeBanUserConfirmDialog}
            />
            <YesNoDialog
                open={isEditUserConfirmDialogOpen}
                title={`${selectedUserType === UserType.Regular ? 'Promote' : 'Demote'} user`}
                text={`Are you sure you want to ${selectedUserType === UserType.Regular ? 'promote' : 'demote'} user '${selectedUserEmail}'?`}
                handleYes={handleEditUser}
                handleNo={closeEditUserConfirmDialog}
                handleClose={closeEditUserConfirmDialog}
            />
            <YesNoDialog
                open={isUnconfirmUserEmailConfirmDialogOpen}
                title={`Unconfirm e-mail`}
                text={`Are you sure you want to unconfirm e-mail address of user '${selectedUserEmail}'?`}
                handleYes={handleUnconfirmUserEmail}
                handleNo={closeUnconfirmUserEmailConfirmDialog}
                handleClose={closeUnconfirmUserEmailConfirmDialog}
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
                <div className={`${classes.form} users`}>
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
                                {users
                                    .sort((a, b) => UserTypeComparator.compare(a.type, b.type))
                                    .reverse()
                                    .map(({ type, email, banned, confirmed }) => (
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
                                                        color='secondary'
                                                        icon={<EmailIcon />}
                                                        loading={isUnconfirmingUserEmail && email === selectedUserEmail}
                                                        disabled={email === userEmail || type === UserType.SuperAdmin}
                                                        onClick={() => openUnconfirmUserEmailConfirmDialog(email, type)}
                                                    >
                                                        Unconfirm
                                                    </LoadingButton>
                                                    <LoadingButton
                                                        className={classes.button}
                                                        variant='contained'
                                                        color={banned ? 'success' : 'error'}
                                                        icon={banned ? <UnbanUserIcon /> : <BanUserIcon />}
                                                        loading={isEditingUser && email === selectedUserEmail}
                                                        disabled={email === userEmail || type === UserType.SuperAdmin}
                                                        onClick={() => openBanUserConfirmDialog(email, type)}
                                                    >
                                                        {banned ? 'Unban' : 'Ban'}
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