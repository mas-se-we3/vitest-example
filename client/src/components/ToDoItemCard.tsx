import { Button, Group, Paper, Stack, Text } from '@mantine/core'
import { ToDoItem } from '../model/ToDoItem'
import classes from './ToDoItemCard.module.css'

type Props = {
  item: ToDoItem
  deleteItem: (item: ToDoItem) => void
  completeItem: (item: ToDoItem) => void
  isDragging: boolean
}

export const ToDoItemCard = ({
  item,
  deleteItem,
  completeItem,
  isDragging,
}: Props) => (
  <Paper
    withBorder
    p="lg"
    m="xs"
    className={isDragging ? classes.shaker : undefined}
    data-testid={`todo-${item.id}`}
  >
    <Stack>
      <Text>{item.text}</Text>
      <Group justify="flex-end">
        <Button color="red" variant="light" onClick={() => deleteItem(item)}>
          Delete
        </Button>
        {item.state === 'pending' && (
          <Button onClick={() => completeItem(item)}>Complete</Button>
        )}
      </Group>
    </Stack>
  </Paper>
)
