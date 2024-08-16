export type ToDoItem = {
  id: string
  text: string
  state: 'pending' | 'completed'
}

export const IsToDoItem = (value: unknown): value is ToDoItem =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof value.id === 'string' &&
  'text' in value &&
  typeof value.text === 'string' &&
  'state' in value &&
  typeof value.state === 'string'

export const ToDoItemsKey = 'ToDoItems'
