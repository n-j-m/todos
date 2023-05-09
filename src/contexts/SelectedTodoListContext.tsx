import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react";

const SelectedTodoListIdContext = createContext('');

const SetSelectedTodoListIdContext = createContext((_x: string) => {});

export function SelectedTodoProvider({ children, initialTodoListId }: PropsWithChildren<{ initialTodoListId: string }>) {
    const [selectedTodoListId, setSelectedTodoListId] = useState(initialTodoListId);

    const setSelected = useCallback((newTodoListId: string) => {
        setSelectedTodoListId(newTodoListId);
    }, []);

    const contextValue = useMemo(() => ({
        selectedTodoListId,
        setSelected
    }), [selectedTodoListId, setSelected]);

    return (
        <SelectedTodoListIdContext.Provider value={contextValue.selectedTodoListId}>
            <SetSelectedTodoListIdContext.Provider value={contextValue.setSelected}>
                {children}
            </SetSelectedTodoListIdContext.Provider>
        </SelectedTodoListIdContext.Provider>
    );
}

export function useSelectedTodoListId() {
    return useContext(SelectedTodoListIdContext);
}

export function useSetSelectedTodoListId() {
    return useContext(SetSelectedTodoListIdContext);
}
