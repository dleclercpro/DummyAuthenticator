import { Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import SearchIcon from '@mui/icons-material/Search';
import BackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '../../buttons/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import useDatabase from '../../../hooks/useDatabase';
import YesNoDialog from '../../dialogs/YesNoDialog';
import useAuth from '../../../hooks/useAuth';
import { UserType } from '../../../constants';

interface Props {

}

const SearchPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();

    const [isSearching, setIsSearching] = useState(false);

    const { isAdmin } = useAuth();
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const [version, setVersion] = useState(0);

    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const openDeleteUserConfirmDialog = (email: string) => {
        setSelectedUserEmail(email);
        setIsDeleteUserConfirmDialogOpen(true);
    }
    const closeDeleteUserConfirmDialog = () => {
        setSelectedUserEmail('');
        setIsDeleteUserConfirmDialogOpen(false);
    }

    const handleDeleteUser = async () => {
        setIsDeleteUserConfirmDialogOpen(false);

        await deleteUser(selectedUserEmail);

        setVersion(version + 1);
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

    // Search everytime the value changes
    useEffect(() => {
        handleSearchUsers();

    }, [value]);

    return (
        <>
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

                <div className={`${classes.form} users`}>
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
                                                        color='error'
                                                        icon={<DeleteIcon />}
                                                        loading={isDeletingUser && email === selectedUserEmail}
                                                        disabled={type === UserType.Admin}
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