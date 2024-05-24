import { Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import SearchIcon from '@mui/icons-material/Search';
import BackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '../../buttons/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/MailLockOutlined';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import BanUserIcon from '@mui/icons-material/Cancel';
import UnbanUserIcon from '@mui/icons-material/Check';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import useDatabase from '../../../hooks/useDatabase';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useAuth from '../../../hooks/useAuth';
import { UserType } from '../../../constants';
import useUser from '../../../hooks/useUser';
import { UserJSON } from '../../../types/JSONTypes';
import UserComparators from '../../../models/comparators/UserComparators';
import { createCompareFunction } from '../../../utils/comparison';
import useBackdrop from '../../../hooks/useBackdrop';

interface Props {

}

const SearchPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();

    const [isSearching, setIsSearching] = useState(false);

    const backdrop = useBackdrop();

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const [version, setVersion] = useState(0);
    const incrementVersion = () => setVersion(version + 1);

    const { userEmail, isAdmin } = useAuth();
    const { isEditingUser, isUnconfirmingUserEmail, banUser, unbanUser, unconfirmUserEmail, demoteUserToRegular, promoteUserToAdmin } = useUser();
    const { users, isDeletingUser, setUsers, searchUsers, deleteUser } = useDatabase();
    
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

    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(false);
    }

    const handleSearchUsers = async () => {
        setIsSearching(true);

        if (value === '') {
            setUsers([]);
        } else {
            await searchUsers(value);
        }

        setIsSearching(false);
    }


    
    // Search everytime the value changes or an action is done
    useEffect(() => {
        handleSearchUsers();

    }, [value, version]);

    // Show loading backdrop when calls are being executed
    useEffect(() => {
        if (!backdrop.isVisible && isLoading) {
            backdrop.show();
        }
        if (backdrop.isVisible && !isLoading) {
            backdrop.hide();
        }

    }, [isLoading]);

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
                <Typography variant='h1' className={classes.title}>
                    Search
                </Typography>

                <form
                    className={classes.form}
                    autoComplete='off'
                    onSubmit={handleSearchUsers}
                >
                    <Typography className={classes.text}>
                        Search for users in the database:
                    </Typography>

                    <div className={classes.fields}>
                        <TextField
                            id='search-page-search-field'
                            className={classes.field}
                            inputProps={{ className: classes.input }}
                            type='text'
                            label='Who are you looking for?'
                            value={value}
                            error={!!error}
                            onChange={handleSearchFieldChange}
                        />
                    </div>

                    <div className={classes.buttons}>
                        <LoadingButton
                            className={classes.button}
                            variant='contained'
                            color='primary'
                            type='submit'
                            icon={<SearchIcon />}
                            loading={isSearching}
                            onClick={handleSearchUsers}
                        >
                            Search
                        </LoadingButton>
                    </div>
                </form>

                <div className={`${classes.form} search`}>
                    {users.length > 0 && (
                        <>
                            <Typography className={classes.text}>
                                List of users that match your search criteria:
                            </Typography>

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
                                            {isAdmin && (
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
                                                    {isAdmin && (
                                                        <td>
                                                            <IconButton
                                                                color={user.type === UserType.Regular ? 'primary' : 'secondary'}
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                                onClick={() => openEditUserConfirmDialog(user)}
                                                            >
                                                                {user.type === UserType.Regular ? <PromoteUserIcon /> : <DemoteUserIcon />}
                                                            </IconButton>
                                                            <IconButton
                                                                color='secondary'
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin || !user.confirmed}
                                                                onClick={() => openUnconfirmUserEmailConfirmDialog(user)}
                                                            >
                                                                <EmailIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color={user.banned ? 'success' : 'error'}
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                                onClick={() => openBanUserConfirmDialog(user)}
                                                            >
                                                                {user.banned ? <UnbanUserIcon /> : <BanUserIcon />}
                                                            </IconButton>
                                                            <IconButton
                                                                color='error'
                                                                disabled={user.email === userEmail || user.type === UserType.SuperAdmin}
                                                                onClick={() => openDeleteUserConfirmDialog(user)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
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

export default SearchPage;