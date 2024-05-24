import { Button, Paper, Typography } from '@mui/material';
import useNoMatchPageStyles from './NoMatchPageStyles';
import { Link } from 'react-router-dom';
import { getURL, Page } from '../../../routes/Router';
import WarningIcon from '@mui/icons-material/Warning';
import { Severity } from '../../../types/CommonTypes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {

}

const NoMatchPage: React.FC<Props> = () => {
    const { classes } = useNoMatchPageStyles();

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
                color='secondary'
                startIcon={<ArrowBackIcon />}
            >
                Back
            </Button>
        </Paper>
    );
}

export default NoMatchPage;