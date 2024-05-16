import { Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthPageStyles from '../AuthPageStyles';
import Snackbar from '../../Snackbar';
import SearchIcon from '@mui/icons-material/Search';
import BackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '../../buttons/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import useDatabase from '../../../hooks/useDatabase';

interface Props {

}

const SearchPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isSearching, setIsSearching] = useState(false);

    const [userEmail, setUserEmail] = useState('');

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const [version, setVersion] = useState(0);

    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const openDeleteUserConfirmDialog = (email: string) => {
        setIsDeleteUserConfirmDialogOpen(true);
    }
    const closeDeleteUserConfirmDialog = () => {
        setIsDeleteUserConfirmDialogOpen(false);
    }

    const handleDeleteUser = async () => {
        setIsDeleteUserConfirmDialogOpen(false);

        await deleteUser(userEmail);

        setVersion(version + 1);
    }

    const { users, admins, isDeletingUser, deleteUser } = useDatabase();

    useEffect(() => {

    }, []);

    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(false);
    }

    const handleSearchUser = () => {
        setIsSearching(true);

        setIsSearching(false);
    }

    return (
        <>
            <Paper elevation={8} className={classes.root}>
                <Typography variant='h1' className={classes.title}>
                    Search
                </Typography>
                
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
                        disabled={isSearching}
                        onChange={handleSearchFieldChange}
                    />
                </div>

                <div className={classes.buttons}>
                    <LoadingButton
                        className={classes.button}
                        variant='contained'
                        color='primary'
                        icon={<SearchIcon />}
                        loading={isSearching}
                        onClick={handleSearchUser}
                    >
                        Search
                    </LoadingButton>
                </div>

                <div className={`${classes.form} users`}>
                    {admins.length > 0 && (
                        <>
                            <Typography className={classes.text}>
                                Here is the list of admin users:
                            </Typography>

                            <table className={classes.table}>
                                {admins.map((email) => (
                                    <tr>
                                        <td>
                                            <Typography>
                                                <strong>{`${email.value} ${email.confirmed ? '✅' : '❌'}`}</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <LoadingButton
                                                className={classes.button}
                                                variant='contained'
                                                color='error'
                                                icon={<DeleteIcon />}
                                                loading={isDeletingUser && email.value === userEmail}
                                                disabled
                                                onClick={() => openDeleteUserConfirmDialog(email.value)}
                                            >
                                                Delete
                                            </LoadingButton>
                                        </td>
                                    </tr>
                                ))}
                            </table>
                        </>
                    )}
                    
                    {users.length > 0 && (
                        <>
                            <Typography className={classes.text}>
                                Here is the list of regular users:
                            </Typography>

                            <table className={classes.table}>
                                {users.map((email) => (
                                    <tr>
                                        <td>
                                            <Typography>
                                                <strong>{`${email.value} ${email.confirmed ? '✅' : '❌'}`}</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <LoadingButton
                                                className={classes.button}
                                                variant='contained'
                                                color='error'
                                                icon={<DeleteIcon />}
                                                loading={isDeletingUser && email.value === userEmail}
                                                onClick={() => openDeleteUserConfirmDialog(email.value)}
                                            >
                                                Delete
                                            </LoadingButton>
                                        </td>
                                    </tr>
                                ))}
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

                <Snackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={Severity.Error}
                    onClose={() => setSnackbarOpen(false)}
                />
            </Paper>
        </>
    );
}

export default SearchPage;