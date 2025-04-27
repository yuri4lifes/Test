import { createContext, useState } from 'react';
import './App.css';
import Form from './components/Form/form';
import Item from './components/Todo/item';
import Remove from './components/Todo/Remove';

export const todoContext = createContext(null);

function App() {
    const [todo, setTodo] = useState([]);

    const handleAdd = (newTodo) => {
        setTodo(prevTodo => [...prevTodo, newTodo]);
    }

    const handleRemove = () => {
        setTodo([]);
    }

    const handleCheck = (id) => {
        const newTodos = [...todo];
        newTodos[id].status = !newTodos[id].status;
        setTodo(newTodos);
    }

    const handleDel = (id) => {
        const newTodos = [...todo];
        newTodos.splice(id, 1);
        setTodo(newTodos);
    }

    const handleEdit = (id) => {
        const newTodos = [...todo];
        newTodos[id].name = prompt("input new name");
        setTodo(newTodos);
    }

    const screen = todo.map((item) => <Item key={item.id} item={item} />);

    return (
        <todoContext.Provider value={{
            todo, handleAdd, handleRemove, setTodo, handleDel, handleCheck, handleEdit
        }}>
            <div className='container'>
                <h1>TODO LIST</h1>
                <Form />
                <div className='todo-container'>
                    {screen}
                </div>
                <div className="todo-bot">
                    <Remove />
                </div>
            </div>
        </todoContext.Provider>
    );
}

export default App;