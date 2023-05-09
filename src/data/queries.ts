import { useQuery } from "@tanstack/react-query";

interface TodoList {
    id: string;
    title: string;
}

interface TodoItems {
    todoListId: string;
    title: string;
    items: TodoItem[];
}

interface TodoItem {
    id: string;
    todoListId: string;
    description: string;
    done: boolean;
}

const todoLists: TodoList[] = [
    { id: 'a', title: 'Create a Todos App' },
    { id: 'b', title: 'Use Todos App' }
];

const todoItems: Map<string, TodoItem[]> = new Map<string, TodoItem[]>(
    [
        ['a', [
            {
                id: 'a',
                todoListId: 'a',
                description: 'Tester a',
                done: false
            },
            {
                id: 'b',
                todoListId: 'a',
                description: 'Test',
                done: false
            }
        ]],
    ['b', []]
]);

function simulateNetwork(min: number = 200, max: number = 1500) {
    return min + Math.random() * (max - min);
}

function getTodoLists(): Promise<TodoList[]> {
    return new Promise(resovle => {
        setTimeout(() => resovle([...todoLists]), simulateNetwork());
    })
}

function getTodoListItems(todoListId: string): Promise<TodoItems> {
    return new Promise<TodoItems>(resolve => {
        const list = todoLists.find(t => t.id === todoListId);
        console.log('getitems:', todoItems.get(todoListId));
        const items: TodoItems = {
            todoListId,
            title: list?.title ?? '',
            items: !!list ? todoItems.get(todoListId) ?? [] : []
        };

        setTimeout(() => resolve(items), simulateNetwork());
    });
}

export function useGetTodoLists() {
    return useQuery<TodoList[], Error>(['todo-lists'], getTodoLists)
}

export function useGetTodoItems(todoListId: string) {
    return useQuery<TodoItems, Error>(['todo-items', todoListId], () => getTodoListItems(todoListId));
}
