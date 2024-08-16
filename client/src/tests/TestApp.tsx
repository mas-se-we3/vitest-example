import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { AppProviders } from '../AppProviders'
import { Routes } from '../Routes'

const memoryRouter = createMemoryRouter(Routes)

export const TestApp = ({
  router,
}: {
  router?: ReturnType<typeof createMemoryRouter>
}) => {
  return (
    <AppProviders>
      <RouterProvider router={router ?? memoryRouter} />
    </AppProviders>
  )
}
