import { Button, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import useAuthPageStyles from '../AuthPageStyles';
import useDatabase from '../../../hooks/useDatabase';
import { Page, getURL } from '../../../routes/Router';
import { Link } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBack';

interface Props {

}

const UsersPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();
    
    const { users, admins, getUsers } = useDatabase();

    useEffect(() => {
        getUsers();
    }, []);

    return (
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

                <ul>
                    {admins.map((admin: string) => (
                        <li>
                            <Typography>
                                <strong>{admin}</strong>
                            </Typography>
                        </li>
                    ))}
                </ul>
                
                <Typography className={classes.text}>
                    Here is the list of regular users:
                </Typography>

                <ul>
                    {users.map((user: string) => (
                        <li>
                            <Typography>
                                <strong>{user}</strong>
                            </Typography>
                        </li>
                    ))}
                </ul>
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

export default UsersPage;