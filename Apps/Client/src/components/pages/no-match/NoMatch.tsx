import { Button, Paper, Typography } from '@mui/material';
import useNoMatchStyles from './NoMatchStyles';
import { Link } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import WarningIcon from '@mui/icons-material/Warning';
import { Severity } from '../../../types/CommonTypes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {

}

const NoMatch: React.FC<Props> = () => {
    const { classes } = useNoMatchStyles();

    return (
        <Paper elevation={8} className={classes.root}>
            <WarningIcon className={classes.icon} color={Severity.Error} fontSize='large' />

            <Typography variant='h1' className={classes.title}>
                Oops!
            </Typography>

            <Typography className={classes.text}>
                This page doesn't exist.
            </Typography>

            <Button
                className={classes.button}
                component={Link}
                to={getURL(Page.Home)}
                variant='contained'
                startIcon={<ArrowBackIcon />}
            >
                Back
            </Button>
        </Paper>
    );
}

export default NoMatch;