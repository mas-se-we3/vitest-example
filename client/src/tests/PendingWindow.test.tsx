import '@testing-library/jest-dom/vitest'
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
import { TestApp } from './TestApp'

const postTodoFn = vitest.fn()
const deleteTodoFn = vitest.fn()
const putTodoFn = vitest.fn()

const handlers = [
  http.get('/api/todos/pending', async () => {
    return HttpResponse.json([{ id: 'id1', text: 'Todo1', state: 'pending' }])
  }),
  http.post('/api/todos', async req => {
    const json = (await req.request.json()) as object
    postTodoFn(json)
    return HttpResponse.json({
      ...json,
      id: crypto.randomUUID(),
    })
  }),
  http.delete('/api/todos/:id', async ({ params }) => {
    const { id } = params
    deleteTodoFn(id)
    return new HttpResponse(null, { status: 204 })
  }),
  http.put('/api/todos/:id', async req => {
    const json = await req.request.json()
    putTodoFn(json)
    return HttpResponse.json(json)
  }),
  http.get('/api/todos/completed', async () => {
    return HttpResponse.json([])
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => {
  postTodoFn.mockReset()
  deleteTodoFn.mockReset()
  putTodoFn.mockReset()
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

    const todo1 = await screen.findByText(/Todo1/)

    expect(todo1).toBeInTheDocument()
  })

  test('Adding items does correct API Call', async () => {
    const user = userEvent.setup()
    render(
      <TestApp>
        <PendingWindow />
      </TestApp>,
    )

    await user.click(screen.getByTestId('add-item'))

    const todoTextbox = await screen.findByRole('textbox', { name: /todo/i })

    await user.type(todoTextbox, 'TestInput')

    await user.click(screen.getByRole('button', { name: /add/i }))

    await waitFor(() =>
      expect(postTodoFn).toHaveBeenCalledWith({
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

    const todoTextBox = await screen.findByRole('textbox', { name: /todo/i })

    await user.type(todoTextBox, 'TestInput')

    await user.click(screen.getByRole('button', { name: /add/i }))

    const testInput = await screen.findByText(/TestInput/)

    expect(testInput).toBeInTheDocument()
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

    await waitFor(() => {
      expect(deleteTodoFn).toHaveBeenCalledWith('id1')
    })
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

    await waitForElementToBeRemoved(todoItem)

    expect(todoItem).not.toBeInTheDocument()
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

    await waitFor(() => {
      expect(putTodoFn).toHaveBeenCalledWith({
        id: 'id1',
        text: 'Todo1',
        state: 'completed',
      })
    })
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

    user.click(completeButton)

    await waitForElementToBeRemoved(todoItem)

    expect(completeButton).not.toBeInTheDocument()
  })
})
