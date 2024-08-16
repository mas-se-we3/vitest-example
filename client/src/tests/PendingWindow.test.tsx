import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, test, vitest } from 'vitest'
import { ToDoItem } from '../model/ToDoItem'
import { TestApp } from './TestApp'

const postTodo = vitest.fn()

const handlers = [
  http.get('/api/todos/pending', async () => {
    return HttpResponse.json([])
  }),
  http.post('/api/todos', async req => {
    const json = (await req.request.json()) as Omit<ToDoItem, 'id'>
    postTodo(json)
    return HttpResponse.json({
      ...json,
      id: crypto.randomUUID(),
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => {
  postTodo.mockReset()
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

test('Adding items does correct API Call', async () => {
  const user = userEvent.setup()
  render(<TestApp />)

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
  render(<TestApp />)

  await user.click(screen.getByTestId('add-item'))

  await user.type(
    await screen.findByRole('textbox', { name: /todo/i }),
    'TestInput',
  )

  await user.click(screen.getByRole('button', { name: /add/i }))

  await waitFor(() => screen.findByText(/TestInput/))
})
