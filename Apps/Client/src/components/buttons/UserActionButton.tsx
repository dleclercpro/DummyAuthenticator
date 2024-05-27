import { ReactNode } from 'react';
import { UserJSON } from '../../types/JSONTypes';
import IconButtonWithTooltip from './IconButtonWithTooltip';

interface Props {
    children: ReactNode,
    user: UserJSON,
    isSelf: boolean,
    selfText: string,
    text: string,
    color?: 'primary' | 'secondary' | 'success' | 'error',
    disabled?: boolean,
    onClick: (() => void) | (() => Promise<void>),
}

const UserActionButton: React.FC<Props> = (props) => {
    const { children, isSelf, selfText, text, color, disabled, onClick } = props;

    return (
        <IconButtonWithTooltip
            text={isSelf ? selfText : text}
            color={color}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </IconButtonWithTooltip>
    )
}

export default UserActionButton;