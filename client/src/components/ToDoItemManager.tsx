import { getCompletedTodos, getPendingTodos } from '../api/todos'
import { ToDoItemList } from './ToDoItemList'

type Props = {
  selectedState: 'pending' | 'completed'
  showCreateModal: boolean
  closeCreateModal: () => void
}

export const ToDoItemManager = ({
  selectedState,
  showCreateModal,
  closeCreateModal,
}: Props) => (
  <ToDoItemList
    closeCreateModal={closeCreateModal}
    showCreateModal={showCreateModal}
    getTodoItems={
      selectedState === 'pending' ? getPendingTodos : getCompletedTodos
    }
  />
)
