import { v4 } from 'uuid'
import { ToDoItem } from './ToDoItem'

type Data = {
  todos: ToDoItem[]
}

let data: Data = {
  todos: [
    {
      id: '0552cd2d-cc13-4054-930a-c4778d2406dd',
      text: 'This is a todo item',
      state: 'pending',
    },
    {
      id: '5596c76a-0666-4e6f-a1b0-4bc240966e79',
      text: 'This is another todo item',
      state: 'pending',
    },
    {
      id: '4f34de9f-76f3-42e0-9428-d0cd6264f293',
      text: 'This is the third todo item',
      state: 'pending',
    },
    {
      id: 'edf34e78-868a-409b-851a-94d1417651c0',
      text: 'This is a completed todo item',
      state: 'completed',
    },
  ],
}

export const getCompletedTodos = () =>
  data.todos.filter(t => t.state === 'completed')

export const getPendingTodos = () =>
  data.todos.filter(t => t.state === 'pending')

export const addTodo = (item: Omit<ToDoItem, 'id'>) => {
  const itemWithId: ToDoItem = { ...item, id: v4() }
  data.todos.push(itemWithId)
  return itemWithId
}

export const removeTodoItem = (id: string) => {
  data.todos = data.todos.filter(todo => todo.id !== id)
}

export const updateTodoItem = (item: ToDoItem) => {
  data.todos = data.todos.map(todo => (todo.id === item.id ? item : todo))
  return item
}
