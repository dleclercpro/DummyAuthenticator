import { IconButton, InputAdornment } from '@mui/material';
import ViewIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';

interface Props {
    visible: boolean,
    onClick: () => void,
}

const ShowPasswordButton: React.FC<Props> = (props) => {
    const { visible, onClick } = props;

    return (
        <InputAdornment position='end'>
            <IconButton onClick={onClick}>
                {visible ? <ViewIcon /> : <HideIcon />}
            </IconButton>
        </InputAdornment>
    )
}

export default ShowPasswordButton;