import { IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode,
    text: string,
    color: 'primary' | 'secondary' | 'success' | 'error',
    disabled?: boolean,
    onClick: (() => void) | (() => Promise<void>),
}

const IconButtonWithTooltip: React.FC<Props> = (props) => {
    const { children, text, color, disabled, onClick } = props;

    return (
        <Tooltip title={text}>
            <span>
                <IconButton
                    color={color}
                    disabled={disabled}
                    onClick={onClick}
                >
                    {children}
                </IconButton>
            </span>
        </Tooltip>
    )
}

export default IconButtonWithTooltip;