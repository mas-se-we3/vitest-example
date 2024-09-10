import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '../AppProviders'

type Props = {
  // inject more initial data here
  children: ReactNode
}

export const TestApp = ({ children }: Props) => {
  // set up state for testing here
  // inject data into your providers

  return (
    <AppProviders>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProviders>
  )
}
