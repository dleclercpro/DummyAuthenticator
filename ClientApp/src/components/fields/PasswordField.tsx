import { TextField } from '@mui/material';
import { useState } from 'react';
import { classnames } from 'tss-react/tools/classnames';
import ViewButton from '../buttons/ViewButton';
import usePasswordFieldStyles from './PasswordFieldStyles';

interface Props {
    className?: string,
    id: string,
    value: string,
    error?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const PasswordField: React.FC<Props> = (props) => {
    const { className, id, value, error, onChange } = props;

    const { classes } = usePasswordFieldStyles();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <TextField
            id={id}
            className={classnames([classes.root, className])}
            inputProps={{ className: classes.input }}
            InputProps={{ endAdornment: <ViewButton visible={showPassword} onClick={togglePasswordVisibility} />}}
            type={showPassword ? 'text' : 'password'}
            label='Password'
            value={value}
            error={!!error}
            onChange={onChange}
        />
    );
}

export default PasswordField;