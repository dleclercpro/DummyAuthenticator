import { createContext, ReactElement, useContext, useState } from 'react';

interface IBackdropContext {
    isVisible: boolean,
    show: () => void,
    hide: () => void,
    toggle: () => void,
}

export const BackdropContext = createContext<IBackdropContext>({} as IBackdropContext);



interface Props {
    children: ReactElement,
}

export const BackdropContextProvider: React.FC<Props> = (props) => {
    const { children } = props;

    const auth = useBackdropContext();
    
    return (
        <BackdropContext.Provider value={auth}>
            {children}
        </BackdropContext.Provider>
    );
}

export default function BackdropContextConsumer() {
    return useContext(BackdropContext);
}



const useBackdropContext = () => {
    const [isVisible, setIsVisible] = useState(false);

    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);
    const toggle = isVisible ? hide : show;

    return {
        isVisible,
        show,
        hide,
        toggle,
    };
}