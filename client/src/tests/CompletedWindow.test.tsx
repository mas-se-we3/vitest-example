import {
  cleanup,
  render,
  waitFor,
  screen,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  beforeAll,
  afterEach,
  afterAll,
  describe,
  test,
  expect,
  vitest,
} from 'vitest'
import { TestApp } from './TestApp'
import { createMemoryRouter } from 'react-router-dom'
import { Routes } from '../Routes'
import userEvent from '@testing-library/user-event'

const deleteTodo = vitest.fn()

const handlers = [
  http.get('/api/todos/completed', async () => {
    return HttpResponse.json([{ id: 'id1', text: 'Todo1', state: 'completed' }])
  }),
  http.delete('/api/todos/:id', async ({ params }) => {
    const { id } = params
    deleteTodo(id)
    return new Response(null, { status: 204 })
  }),
  http.get('/api/todos/pending', async () => {
    return HttpResponse.json([])
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

const completedRouter = createMemoryRouter(Routes, {
  initialEntries: ['/completed'],
})

describe('Completed Window', () => {
  test('Todo item from API is shown', async () => {
    render(<TestApp router={completedRouter} />)

    await expect(
      waitFor(() => screen.findByText(/Todo1/)),
    ).resolves.toBeDefined()
  })

  test('Deleting items does correct API Call', async () => {
    const user = userEvent.setup()
    render(<TestApp router={completedRouter} />)

    const todoItem = await screen.findByTestId('todo-id1')

    const deleteButton = within(todoItem).getByRole('button', {
      name: /delete/i,
    })

    await user.click(deleteButton)

    await waitFor(() => expect(deleteTodo).toHaveBeenCalledWith('id1'))
  })

  test('Deleting items does remove from UI', async () => {
    const user = userEvent.setup()
    render(<TestApp router={completedRouter} />)

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

  test('Going to pending changes routing', async () => {
    const user = userEvent.setup()
    render(<TestApp router={completedRouter} />)

    const toCompletedButton = await screen.findByRole('button', {
      name: /to pending/i,
    })

    await user.click(toCompletedButton)

    expect(completedRouter.state.location.pathname).toBe('/')
  })
})
