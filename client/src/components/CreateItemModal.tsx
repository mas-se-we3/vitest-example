import { Button, Modal, Stack, Textarea } from '@mantine/core'
import { ToDoItem } from '../model/ToDoItem'
import { useState } from 'react'

export type CreateItemModal = {
  show: boolean
  onClose: () => void
  onSuccess: (item: Omit<ToDoItem, 'id'>) => void
}

export const CreateItemModal = ({
  onSuccess,
  show,
  onClose,
}: CreateItemModal) => {
  const [text, setText] = useState('')

  const onThisClose = () => {
    setText('')
    onClose()
  }

  return (
    <Modal onClose={onThisClose} opened={show} title="Create Item">
      <form
        onSubmit={e => {
          e.preventDefault()
          onSuccess({ text, state: 'pending' })
          setText('')
        }}
      >
        <Stack>
          <Textarea
            label="ToDo"
            value={text}
            onChange={e => setText(e.currentTarget.value)}
          />
          <Button type="submit">Add</Button>
        </Stack>
      </form>
    </Modal>
  )
}
