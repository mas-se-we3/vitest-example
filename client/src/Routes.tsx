import { RouteObject } from 'react-router-dom'
import { CompletedWindow } from './components/windows/CompletedWindow'
import { PendingWindow } from './components/windows/PendingWindow'

export const Routes: RouteObject[] = [
  {
    path: '/',
    element: <PendingWindow />,
  },
  {
    path: 'completed',
    element: <CompletedWindow />,
  },
]
