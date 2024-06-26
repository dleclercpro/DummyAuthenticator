import { TextField } from '@mui/material';
import { useState } from 'react';
import { classnames } from 'tss-react/tools/classnames';
import ViewButton from '../buttons/ViewButton';
import usePasswordFieldStyles from './PasswordFieldStyles';

interface Props {
    className?: string,
    id: string,
    label?: string,
    value: string,
    error?: boolean,
    disabled?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const PasswordField: React.FC<Props> = (props) => {
    const { className, id, label, value, error, disabled, onChange } = props;

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
            label={label ?? 'Password'}
            value={value}
            error={!!error}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default PasswordField;