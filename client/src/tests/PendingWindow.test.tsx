import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vitest,
} from 'vitest'
import { PendingWindow } from '../components/windows/PendingWindow'
import { ToDoItem } from '../model/ToDoItem'
import { TestApp } from './TestApp'

const postTodo = vitest.fn()
const deleteTodo = vitest.fn()
const putTodo = vitest.fn()

const handlers = [
  http.get('/api/todos/pending', async () => {
    return HttpResponse.json([{ id: 'id1', text: 'Todo1', state: 'pending' }])
  }),
  http.post('/api/todos', async req => {
    const json = (await req.request.json()) as Omit<ToDoItem, 'id'>
    postTodo(json)
    return HttpResponse.json({
      ...json,
      id: crypto.randomUUID(),
    })
  }),
  http.delete('/api/todos/:id', async ({ params }) => {
    const { id } = params
    deleteTodo(id)
    return new Response(null, { status: 204 })
  }),
  http.put('/api/todos', async req => {
    const json = (await req.request.json()) as ToDoItem
    putTodo(json)
    return HttpResponse.json(json)
  }),
  http.get('/api/todos/completed', async () => {
    return HttpResponse.json([])
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => {
  postTodo.mockReset()
  deleteTodo.mockReset()
  putTodo.mockReset()
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

describe('Pending Window', () => {
  test('Todo item from API is shown', async () => {
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    await expect(
      waitFor(() => screen.findByText(/Todo1/)),
    ).resolves.toBeDefined()
  })

  test('Adding items does correct API Call', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    await user.click(screen.getByTestId('add-item'))

    await user.type(
      await screen.findByRole('textbox', { name: /todo/i }),
      'TestInput',
    )

    await user.click(screen.getByRole('button', { name: /add/i }))

    await waitFor(() =>
      expect(postTodo).toHaveBeenCalledWith({
        text: 'TestInput',
        state: 'pending',
      }),
    )
  })

  test('Adding items does show in UI', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    await user.click(screen.getByTestId('add-item'))

    await user.type(
      await screen.findByRole('textbox', { name: /todo/i }),
      'TestInput',
    )

    await user.click(screen.getByRole('button', { name: /add/i }))

    await expect(
      waitFor(() => screen.findByText(/TestInput/)),
    ).resolves.toBeDefined()
  })

  test('Deleting items does correct API Call', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    const todoItem = await screen.findByTestId('todo-id1')

    const deleteButton = within(todoItem).getByRole('button', {
      name: /delete/i,
    })

    await user.click(deleteButton)

    await waitFor(() => expect(deleteTodo).toHaveBeenCalledWith('id1'))
  })

  test('Deleting items does remove from UI', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    const todoItem = await screen.findByTestId('todo-id1')

    const deleteButton = within(todoItem).getByRole('button', {
      name: /delete/i,
    })

    // Intentionally don't wait for click to complete, we just wait for the element removal instead
    user.click(deleteButton)

    await expect(
      waitForElementToBeRemoved(screen.queryByTestId('todo-id1')),
    ).resolves.toBeUndefined()
  })

  test('Completing items does correct API Call', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    const todoItem = await screen.findByTestId('todo-id1')

    const completeButton = within(todoItem).getByRole('button', {
      name: /complete/i,
    })

    await user.click(completeButton)

    await waitFor(() =>
      expect(putTodo).toHaveBeenCalledWith({
        id: 'id1',
        text: 'Todo1',
        state: 'completed',
      }),
    )
  })

  test('Completing items does remove from UI', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    const todoItem = await screen.findByTestId('todo-id1')

    const completeButton = within(todoItem).getByRole('button', {
      name: /complete/i,
    })

    // Intentionally don't wait for click to complete, we just wait for the element removal instead
    user.click(completeButton)

    await expect(
      waitForElementToBeRemoved(screen.queryByTestId('todo-id1')),
    ).resolves.toBeUndefined()
  })
})
