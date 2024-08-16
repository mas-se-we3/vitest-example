import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Loader, Stack } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { useCallback, useEffect, useState } from 'react'
import { ApiResponse } from '../api'
import { addNewTodo, deleteTodo, updateTodo } from '../api/todos'
import { ToDoItem } from '../model/ToDoItem'
import { ToDoItemCard } from './ToDoItemCard'
import { CreateItemModal } from './CreateItemModal'

export type ToDoItemListProps = {
  getTodoItems: () => Promise<ApiResponse<ToDoItem[]>>
  showCreateModal: boolean
  closeCreateModal: () => void
}

export const ToDoItemList = ({
  getTodoItems,
  showCreateModal,
  closeCreateModal,
}: ToDoItemListProps) => {
  const [items, handler] = useListState<ToDoItem>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    getTodoItems()
      .then(r => {
        if (!r.ok) {
          return
        }

        handler.setState(r.data)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTodoItems])

  const deleteItem = useCallback(
    async (item: ToDoItem) => {
      const result = await deleteTodo(item.id)
      if (result.ok) {
        handler.filter(t => t.id !== item.id)
      }
    },
    [handler],
  )

  const setItemCompleted = useCallback(
    async (item: ToDoItem) => {
      const updatedItem: ToDoItem = { ...item, state: 'completed' }

      const result = await updateTodo(updatedItem)
      if (result.ok) {
        handler.filter(todo => todo.id !== result.data.id)
      }
    },
    [handler],
  )

  const addItem = useCallback(
    async (newItem: Omit<ToDoItem, 'id'>) => {
      const result = await addNewTodo(newItem)
      if (result.ok) {
        handler.append(result.data)
      }
    },
    [handler],
  )

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
