import { Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import BackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '../../buttons/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmEmailIcon from '@mui/icons-material/MarkEmailReadOutlined';
import UnconfirmEmailIcon from '@mui/icons-material/MailLockOutlined';
import PromoteUserIcon from '@mui/icons-material/ArrowCircleUp';
import DemoteUserIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveFavoriteIcon from '@mui/icons-material/StarBorder';
import AddFavoriteIcon from '@mui/icons-material/Star';
import BanUserIcon from '@mui/icons-material/Cancel';
import UnbanUserIcon from '@mui/icons-material/Check';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import useDatabase from '../../../hooks/useDatabase';
import useAuthContext from '../../../contexts/AuthContext';
import { DialogName, UserType } from '../../../constants';
import { UserJSON } from '../../../types/JSONTypes';
import UserComparators from '../../../models/comparators/UserComparators';
import { createCompareFunction } from '../../../utils/comparison';
import { SEARCH_MIN_CHARACTERS } from '../../../config/Config';
import useSearchPageStyles from './SearchPageStyles';
import UserActionButton from '../../buttons/UserActionButton';
import useDialogContext from '../../../contexts/DialogContext';

interface Props {

}

const SearchPage: React.FC<Props> = () => {
    const { classes } = useSearchPageStyles();

    const { openDialog, setDialogUser, setDialogAfterAction } = useDialogContext();

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const canSearch = value.length >= SEARCH_MIN_CHARACTERS;

    const { userEmail, isAdmin, isSuperAdmin } = useAuthContext();
    const { users, isSearching, setUsers, searchUsers } = useDatabase();



    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(false);
    }



    const handleSearchUsers = async () => {
        await searchUsers(value);
    }



    // Search everytime the value changes or an action is done
    useEffect(() => {
        if (!canSearch) {
            if (users.length > 0) {
                setUsers([]);
            }
            return;
        }

        searchUsers(value);

    }, [value]);

    return (
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
                    {`Enter at least ${SEARCH_MIN_CHARACTERS} characters to search for users in the database:`}
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
                                            <tr key={`user-${user.email}`}>
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
                                                            onClick={() => {
                                                                setDialogUser(DialogName.PromoteOrDemoteUser, user);
                                                                setDialogAfterAction(DialogName.PromoteOrDemoteUser, handleSearchUsers);
                                                                openDialog(DialogName.PromoteOrDemoteUser);
                                                            }}
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
                                                            onClick={() => {
                                                                setDialogUser(DialogName.ConfirmOrInfirmEmailAddress, user);
                                                                setDialogAfterAction(DialogName.ConfirmOrInfirmEmailAddress, handleSearchUsers);
                                                                openDialog(DialogName.ConfirmOrInfirmEmailAddress);
                                                            }}
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
                                                            onClick={() => {
                                                                setDialogUser(DialogName.AddToOrRemoveFromFavoriteUsers, user);
                                                                setDialogAfterAction(DialogName.AddToOrRemoveFromFavoriteUsers, handleSearchUsers);
                                                                openDialog(DialogName.AddToOrRemoveFromFavoriteUsers);
                                                            }}
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
                                                            onClick={() => {
                                                                setDialogUser(DialogName.BanUser, user);
                                                                setDialogAfterAction(DialogName.BanUser, handleSearchUsers);
                                                                openDialog(DialogName.BanUser);
                                                            }}
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
                                                            onClick={() => {
                                                                setDialogUser(DialogName.DeleteUser, user);
                                                                setDialogAfterAction(DialogName.DeleteUser, handleSearchUsers);
                                                                openDialog(DialogName.DeleteUser);
                                                            }}
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
    );
}

export default SearchPage;