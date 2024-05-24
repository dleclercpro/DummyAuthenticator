import { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { DialogName } from '../constants';
import { UserJSON } from '../types/JSONTypes';
import useUser from './useUser';
import useDatabase from './useDatabase';
import useBackdrop from './useBackdrop';

type DialogState = {
    open: boolean,
    user: UserJSON | null,
    action: () => Promise<void>,
}

type Dialogs = {
    [dialog in DialogName]: DialogState;
};

const DIALOGS_INIT_STATE: Dialogs = {
    [DialogName.AddToOrRemoveFromFavoriteUsers]: {
        open: false,
        user: null,
        action: () => Promise.resolve(),
    },
    [DialogName.PromoteOrDemoteUser]: {
        open: false,
        user: null,
        action: () => Promise.resolve(),
    },
    [DialogName.BanUser]: {
        open: false,
        user: null,
        action: () => Promise.resolve(),
    },
    [DialogName.ConfirmOrInfirmEmailAddress]: {
        open: false,
        user: null,
        action: () => Promise.resolve(),
    },
    [DialogName.DeleteUser]: {
        open: false,
        user: null,
        action: () => Promise.resolve(),
    },
}

interface IDialogContext {
    isDialogOpen: (name: DialogName) => boolean,
    openDialog: (name: DialogName) => void,
    closeDialog: (name: DialogName) => void,
    toggleDialog: (name: DialogName) => void,
    getDialogUser: (name: DialogName) => UserJSON | null,
    setDialogUser: (name: DialogName, user: UserJSON | null) => void,
    getDialogAction: (name: DialogName) => () => Promise<void>,
    setDialogAction: (name: DialogName, action: () => Promise<void>) => void,
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

    const backdrop = useBackdrop(); 

    const { isEditingUser } = useUser();
    const { isDeletingUser } = useDatabase();

    const isLoading = isEditingUser || isDeletingUser;



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

    const getDialogAction = (name: DialogName) => {
        return dialogs[name].action;
    }

    const setDialogAction = (name: DialogName, action: () => Promise<void>) => {
        dialogs[name].action = action;
    }

    // Show loading backdrop when calls are being executed
    useEffect(() => {
        if (!backdrop.isVisible && isLoading) {
            backdrop.show();
        }
        if (backdrop.isVisible && !isLoading) {
            backdrop.hide();
        }

    }, [isLoading]);

    return {
        isDialogOpen,
        openDialog,
        closeDialog,
        toggleDialog,
        getDialogUser,
        setDialogUser,
        getDialogAction,
        setDialogAction,
    };
}