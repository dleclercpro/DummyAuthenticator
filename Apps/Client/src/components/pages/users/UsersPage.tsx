import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import useDatabase from '../../../hooks/useDatabase';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '../../buttons/LoadingButton';
import YesNoDialog from '../../dialogs/YesNoDialog';

interface Props {

}

const UsersPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();
    
    const [version, setVersion] = useState(0);

    const [userEmail, setUserEmail] = useState('');

    const [isDeleteUserConfirmDialogOpen, setIsDeleteUserConfirmDialogOpen] = useState(false);

    const openDeleteUserConfirmDialog = (email: string) => {
        setUserEmail(email);
        setIsDeleteUserConfirmDialogOpen(true);
    }
    const closeDeleteUserConfirmDialog = () => {
        setUserEmail('');
        setIsDeleteUserConfirmDialogOpen(false);
    }

    const handleDeleteUser = async () => {
        setIsDeleteUserConfirmDialogOpen(false);

        await deleteUser(userEmail);

        setVersion(version + 1);
    }

    const { users, admins, isDeletingUser, deleteUser, getUsers } = useDatabase();

    useEffect(() => {
        getUsers();

    }, [version]);

    if (!admins || !users) {
        return null;
    }

    return (
        <>
            <YesNoDialog
                open={isDeleteUserConfirmDialogOpen}
                title='Delete user'
                text={`Are you sure you want to delete user '${userEmail}'?`}
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
                        Here is the list of admin users:
                    </Typography>

                    <table className={classes.table}>
                        {admins.map((email) => (
                            <tr>
                                <td>
                                    <Typography>
                                        <strong>{email}</strong>
                                    </Typography>
                                </td>
                                <td>
                                    <LoadingButton
                                        className={classes.button}
                                        variant='contained'
                                        color='error'
                                        icon={<DeleteIcon />}
                                        loading={isDeletingUser && email === userEmail}
                                        disabled
                                        onClick={() => openDeleteUserConfirmDialog(email)}
                                    >
                                        Delete
                                    </LoadingButton>
                                </td>
                            </tr>
                        ))}
                    </table>
                    
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
                                                <strong>{email}</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <LoadingButton
                                                className={classes.button}
                                                variant='contained'
                                                color='error'
                                                icon={<DeleteIcon />}
                                                loading={isDeletingUser && email === userEmail}
                                                onClick={() => openDeleteUserConfirmDialog(email)}
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
            </Paper>
        </>
    );
}

export default UsersPage;