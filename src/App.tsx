import { useState } from 'react';
import { Button, Checkbox, Drawer, Input, Menu, Modal, Navbar, Table } from 'react-daisyui';
import { queryClient, useGetTodoItems, useGetTodoLists } from './data';
import { QueryClientProvider } from '@tanstack/react-query';
import { SelectedTodoProvider, useSelectedTodoListId, useSetSelectedTodoListId } from './contexts/SelectedTodoListContext';
import { CreateTodoListModalProvider, useCreateTodoListModalVisible, useSetCreateTodoListModalVisible } from './contexts/CreateTodoModalContext';

function classList(classes: any) {
  return Object
    .entries(classes)
    .filter(entry => !!entry[1])
    .map(entry => entry[0])
    .join(' ');
}

function TodoListsList() {
  const todoLists = useGetTodoLists();
  const setSelectedTodoListId = useSetSelectedTodoListId();
  const selectedTodoListId = useSelectedTodoListId();

  let items = [
    <Menu.Item key="">
      <label className="justify-center">Loading...</label>
    </Menu.Item>
  ];

  if (todoLists.isError)
    items = [
      <Menu.Item key="">
        <label className="justify-center">ERROR: {todoLists.error.message}</label>
      </Menu.Item>
    ];
  
  if (todoLists.data)
    items = todoLists.data.map(list => (
      <Menu.Item key={list.id} className="my-2" onClick={() => setSelectedTodoListId(list.id)}>
        <a className={classList({ btn: true, 'justify-center': true, 'btn-ghost': list.id !== selectedTodoListId})}>{list.title}</a>
      </Menu.Item>
    ));

  return (
    <Menu className="p-4 w-80 bg-base-100 overflow-y-auto text-base-content">
      <Menu.Item>
        <Button color="info" variant="outline">
          Create New Todo List
        </Button>
      </Menu.Item>
      {items}
    </Menu>
  );
}

function WorkingTodoList() {
  const selectedTodoListId = useSelectedTodoListId();
  const todoItems = useGetTodoItems(selectedTodoListId);
  
  if (todoItems.isFetching)
    return (
      <h1>Loading...</h1>
    );
  
  if (todoItems.isError)
      return (
        <h1>ERROR: {todoItems.error.message}</h1>
      );

  return (
    <Table compact={false} className="w-full">
      <Table.Head>
        <span>Done</span>
        <span>Description</span>
      </Table.Head>
      <Table.Body>
        {todoItems.data?.items.map(item => (
          <Table.Row key={item.id}>
            <span>
              <Checkbox defaultChecked={item.done} />
            </span>
            <span>
              {item.description}
            </span>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function Layout() {
  const [visible, setVisible] = useState(false);
  const createTodoListVisible = useCreateTodoListModalVisible();
  const setCreateTodoListVisible = useSetCreateTodoListModalVisible();

  const toggleCreateTodoList = () => setCreateTodoListVisible(!createTodoListVisible);

  const toggleVisible = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Drawer side={<TodoListsList />} mobile={true} open={visible} onClickOverlay={toggleVisible} contentClassName="flex flex-col">
        <Navbar className="w-full">
          <div className="flex-none lg:hidden">
            <Button shape="square" color="ghost" onClick={() => toggleVisible()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
          <div className="flex-1 px-2 mx-2">Todos</div>
        </Navbar>
        <div className="flex flex-grow justify-center bg-base-300">
          <div className="pt-12 flex flex-col items-center w-1/2">
            <WorkingTodoList />
          </div>

        </div>
      </Drawer>
      <Modal open={createTodoListVisible} onClickBackdrop={() => toggleCreateTodoList()}>
        <Button size="sm" shape="circle" className="absolute right-2 top-2" onClick={() => toggleCreateTodoList()}>
          ✕
        </Button>
        <Modal.Header>
          Create Todo List
        </Modal.Header>

        <Modal.Body>
          <div className="flex w-full p-4 items-center justify-center gap-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title</span>
                <span className="label-text-alt">Enter a new todo list title</span>
              </label>
              <Input placeholder="Todo List Title" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button color="info">OK</Button>
          <Button>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedTodoProvider initialTodoListId="a">
        <CreateTodoListModalProvider initialVisible={true}>
          <Layout />
        </CreateTodoListModalProvider>
      </SelectedTodoProvider>
    </QueryClientProvider>
  );
}

export default App
