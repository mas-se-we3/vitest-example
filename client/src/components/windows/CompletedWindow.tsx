import { Box, Button, Group, Stack, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { ToDoItemManager } from '../ToDoItemManager'

export const CompletedWindow = () => (
  <Stack h="100%" align="center" p="sm">
    <Group justify="space-between" w="100%" maw={400}>
      <Title>Completed</Title>
      <Group gap="xs">
        <Link to="/">
          <Button variant="subtle">To Pending</Button>
        </Link>
      </Group>
    </Group>
    <Box maw={500} h="100%" w="100%">
      <ToDoItemManager
        closeCreateModal={() => {}}
        selectedState="completed"
        showCreateModal={false}
      />
    </Box>
  </Stack>
)
