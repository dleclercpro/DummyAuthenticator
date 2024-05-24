import { Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import SearchIcon from '@mui/icons-material/Search';
import BackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '../../buttons/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import useDatabase from '../../../hooks/useDatabase';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useAuth from '../../../hooks/useAuth';
import { UserType } from '../../../constants';
import useUser from '../../../hooks/useUser';
import UserTypeComparator from '../../../models/UserTypeComparator';

interface Props {

}

const SearchPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();

    const [isSearching, setIsSearching] = useState(false);

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

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

    const { users, isDeletingUser, setUsers, searchUsers, deleteUser } = useDatabase();

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
                                        .map(({ type, email, confirmed }) => (
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