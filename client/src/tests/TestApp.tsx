import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { AppProviders } from '../AppProviders'
import { Routes } from '../Routes'

const memoryRouter = createMemoryRouter(Routes)

export const TestApp = () => {
  return (
    <AppProviders>
      <RouterProvider router={memoryRouter} />
    </AppProviders>
  )
}
