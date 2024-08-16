import { ActionIcon, Box, Button, Group, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { ToDoItemManager } from '../ToDoItemManager'
import { Link } from 'react-router-dom'

export const PendingWindow = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <Stack h="100%" align="center" p="sm">
      <Group justify="space-between" w="100%" maw={400}>
        <Title>ToDo</Title>
        <Group gap="xs">
          <Link to="/completed">
            <Button variant="subtle">To Completed</Button>
          </Link>
          <ActionIcon
            onClick={() => setShowCreateModal(true)}
            data-testid="add-item"
          >
            <FiPlusCircle />
          </ActionIcon>
        </Group>
      </Group>
      <Box maw={500} h="100%" w="100%">
        <ToDoItemManager
          closeCreateModal={() => setShowCreateModal(false)}
          selectedState="pending"
          showCreateModal={showCreateModal}
        />
      </Box>
    </Stack>
  )
}
