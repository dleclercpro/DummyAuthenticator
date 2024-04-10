import { TextField } from '@mui/material';
import { classnames } from 'tss-react/tools/classnames';
import useEmailFieldStyles from './EmailFieldStyles';

interface Props {
    className?: string,
    id: string,
    value: string,
    error?: boolean,
    disabled?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const EmailField: React.FC<Props> = (props) => {
    const { className, id, value, error, disabled, onChange } = props;
    
    const { classes } = useEmailFieldStyles();

    return (
        <TextField
            id={id}
            className={classnames([classes.root, className])}
            inputProps={{ className: classes.input }}
            type='email'
            label='E-mail'
            value={value}
            error={!!error}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

export default EmailField;