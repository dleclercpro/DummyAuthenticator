import { Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Severity } from '../../../types/CommonTypes';
import useAuthPageStyles from '../AuthPageStyles';
import Snackbar from '../../Snackbar';
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '../../buttons/LoadingButton';

interface Props {

}

const SearchPage: React.FC<Props> = () => {
    const { classes } = useAuthPageStyles();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isSearching, setIsSearching] = useState(false);

    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

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