import { ApiResponse, handleResponse } from '.'
import { ToDoItem } from '../model/ToDoItem'

export const getPendingTodos = async (): Promise<ApiResponse<ToDoItem[]>> => {
  const response = await fetch('/api/todos/pending')
  return await handleResponse(response)
}

export const getCompletedTodos = async (): Promise<ApiResponse<ToDoItem[]>> => {
  const response = await fetch('/api/todos/completed')
  return await handleResponse(response)
}

export const addNewTodo = async (
  newTodo: Omit<ToDoItem, 'id'>,
): Promise<ApiResponse<ToDoItem>> => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  })
  return await handleResponse(response)
}

export const deleteTodo = async (
  id: string,
): Promise<ApiResponse<undefined>> => {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  })
  return await handleResponse(response)
}

export const updateTodo = async (
  item: ToDoItem,
): Promise<ApiResponse<ToDoItem>> => {
  const respones = await fetch('/api/todos', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(item),
  })

  return await handleResponse(respones)
}
