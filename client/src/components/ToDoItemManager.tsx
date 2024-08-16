import { getCompletedTodos, getPendingTodos } from '../api/todos'
import { ToDoItemList } from './ToDoItemList'

export type ToDoItemManagerProps = {
  selectedState: 'pending' | 'completed'
  showCreateModal: boolean
  closeCreateModal: () => void
}

export const ToDoItemManager = ({
  selectedState,
  showCreateModal,
  closeCreateModal,
}: ToDoItemManagerProps) => (
  <ToDoItemList
    closeCreateModal={closeCreateModal}
    showCreateModal={showCreateModal}
    getTodoItems={
      selectedState === 'pending' ? getPendingTodos : getCompletedTodos
    }
  />
)
