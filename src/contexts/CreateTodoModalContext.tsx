import { PropsWithChildren, createContext, useContext, useState } from "react";

const CreateTodoListModalVisibleContext = createContext(false);
const SetCreateTodoListModalVisibleContext = createContext((_x: boolean) => {});

export const CreateTodoListModalProvider = ({ children, initialVisible}: PropsWithChildren<{ initialVisible: boolean }>) => {
    const [visible, setVisible] = useState(initialVisible);

    return (
        <CreateTodoListModalVisibleContext.Provider value={visible}>
            <SetCreateTodoListModalVisibleContext.Provider value={setVisible}>
                { children }
            </SetCreateTodoListModalVisibleContext.Provider>
        </CreateTodoListModalVisibleContext.Provider>
    )
};

export const useCreateTodoListModalVisible = () => useContext(CreateTodoListModalVisibleContext);
export const useSetCreateTodoListModalVisible = () => useContext(SetCreateTodoListModalVisibleContext);
