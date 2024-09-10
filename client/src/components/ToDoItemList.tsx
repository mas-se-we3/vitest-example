import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Loader, Stack } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { ApiResponse } from '../api'
import { addNewTodo, deleteTodo, updateTodo } from '../api/todos'
import { ToDoItem } from '../model/ToDoItem'
import { CreateItemModal } from './CreateItemModal'
import { ToDoItemCard } from './ToDoItemCard'

type Props = {
  getTodoItems: () => Promise<ApiResponse<ToDoItem[]>>
  showCreateModal: boolean
  closeCreateModal: () => void
}

export const ToDoItemList = ({
  getTodoItems,
  showCreateModal,
  closeCreateModal,
}: Props) => {
  const [items, { setState, ...handler }] = useListState<ToDoItem>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    getTodoItems()
      .then(r => {
        if (!r.ok) return
        setState(r.data)
      })
      .finally(() => setLoading(false))
  }, [getTodoItems, setState])

  const deleteItem = async (item: ToDoItem) => {
    const result = await deleteTodo(item.id)
    if (result.ok) {
      handler.filter(t => t.id !== item.id)
    }
  }

  const setItemCompleted = async (item: ToDoItem) => {
    const updatedItem: ToDoItem = { ...item, state: 'completed' }

    const result = await updateTodo(updatedItem)
    if (result.ok) {
      handler.filter(todo => todo.id !== result.data.id)
    }
  }

  const addItem = async (newItem: Omit<ToDoItem, 'id'>) => {
    const result = await addNewTodo(newItem)
    if (result.ok) {
      handler.append(result.data)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handler.reorder({
            from: source.index,
            to: destination?.index ?? 0,
          })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {provided => (
            <Stack
              {...provided.droppableProps}
              ref={provided.innerRef}
              gap={0}
              h="100%"
            >
              {items.map((todo, i) => (
                <Draggable key={todo.id} index={i} draggableId={todo.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <ToDoItemCard
                        isDragging={snapshot.isDragging}
                        item={todo}
                        deleteItem={deleteItem}
                        completeItem={setItemCompleted}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
      <CreateItemModal
        show={showCreateModal}
        onClose={closeCreateModal}
        onSuccess={item => {
          addItem(item)
          closeCreateModal()
        }}
      />
    </>
  )
}
