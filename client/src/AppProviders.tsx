import { createTheme, MantineProvider } from '@mantine/core'
import { PropsWithChildren } from 'react'

const theme = createTheme({
  autoContrast: true,
  colors: {
    todo: [
      '#e3fff0',
      '#d1fae3',
      '#a5f3c8',
      '#76ebab',
      '#50e592',
      '#36e182',
      '#24df79',
      '#10c668',
      '#00b05a',
      '#00984a',
    ],
  },
  primaryColor: 'todo',
})

export const AppProviders = ({ children }: PropsWithChildren) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
