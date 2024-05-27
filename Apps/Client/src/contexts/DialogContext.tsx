import { createContext, ReactElement, useContext, useState } from 'react';
import { DialogName } from '../constants';
import { UserJSON } from '../types/JSONTypes';

type DialogState = {
    open: boolean,
    user: UserJSON | null,
    actions: {
        before: () => Promise<void>,
        after: () => Promise<void>,
    },
}

type Dialogs = {
    [dialog in DialogName]: DialogState;
};

const generateDialogInitState = () => ({
    open: false,
    user: null,
    actions: {
        before: () => Promise.resolve(),
        after: () => Promise.resolve(),
    },
});

const DIALOGS_INIT_STATE: Dialogs = {
    [DialogName.AddToOrRemoveFromFavoriteUsers]: generateDialogInitState(),
    [DialogName.PromoteOrDemoteUser]: generateDialogInitState(),
    [DialogName.BanUser]: generateDialogInitState(),
    [DialogName.ConfirmOrInfirmEmailAddress]: generateDialogInitState(),
    [DialogName.DeleteUser]: generateDialogInitState(),
}

interface IDialogContext {
    isDialogOpen: (name: DialogName) => boolean,
    openDialog: (name: DialogName) => void,
    closeDialog: (name: DialogName) => void,
    toggleDialog: (name: DialogName) => void,
    getDialogUser: (name: DialogName) => UserJSON | null,
    setDialogUser: (name: DialogName, user: UserJSON | null) => void,
    getDialogBeforeAction: (name: DialogName) => () => Promise<void>,
    getDialogAfterAction: (name: DialogName) => () => Promise<void>,
    setDialogBeforeAction: (name: DialogName, action: () => Promise<void>) => void,
    setDialogAfterAction: (name: DialogName, action: () => Promise<void>) => void,
}

export const DialogContext = createContext<IDialogContext>({} as IDialogContext);



interface Props {
    children: ReactElement,
}

export const DialogContextProvider: React.FC<Props> = (props) => {
    const { children } = props;

    const Dialog = useDialog();
    
    return (
        <DialogContext.Provider value={Dialog}>
            {children}
        </DialogContext.Provider>
    );
}

export default function DialogContextConsumer() {
    return useContext(DialogContext);
}



const useDialog = () => {
    const [dialogs, setDialogs] = useState<Dialogs>(DIALOGS_INIT_STATE);

    const isDialogOpen = (name: DialogName) => {
        return dialogs[name].open;
    }
    
    const openDialog = (name: DialogName) => {
        setDialogs({
            ...dialogs,
            [name]: {
                ...dialogs[name],
                open: true,
            },
        })
    };

    const closeDialog = (name: DialogName) => {
        setDialogs({
            ...dialogs,
            [name]: {
                ...dialogs[name],
                open: false,
            },
        })
    };

    const toggleDialog = (name: DialogName) => {
        isDialogOpen(name) ? closeDialog(name) : openDialog(name);
    }

    const getDialogUser = (name: DialogName) => {
        return dialogs[name].user;
    }

    const setDialogUser = (name: DialogName, user: UserJSON | null) => {
        dialogs[name].user = user;
    }

    const getDialogBeforeAction = (name: DialogName) => {
        return dialogs[name].actions.before;
    }

    const getDialogAfterAction = (name: DialogName) => {
        return dialogs[name].actions.after;
    }

    const setDialogBeforeAction = (name: DialogName, action: () => Promise<void>) => {
        dialogs[name].actions.before = action;
    }

    const setDialogAfterAction = (name: DialogName, action: () => Promise<void>) => {
        dialogs[name].actions.after = action;
    }

    return {
        isDialogOpen,
        openDialog,
        closeDialog,
        toggleDialog,
        getDialogUser,
        setDialogUser,
        getDialogBeforeAction,
        getDialogAfterAction,
        setDialogBeforeAction,
        setDialogAfterAction,
    };
}