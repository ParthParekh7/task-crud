import React, { useState } from 'react'
import { MenuItem, Select } from '@mui/material'
import axiosInstance from '../axiosInstance'
import { useSnackbar } from '../snakebarContext'

const TaskStatusDropdown = ({ task, onStatusChange, setStatusFilter }) => {
  const [status, setStatus] = useState(task.status)
  const { showSnackbar } = useSnackbar()

  const handleChange = async (newStatus) => {
    setStatus(newStatus)
    try {
      await axiosInstance.patch(`/tasks/${task._id}`, { status: newStatus })
      showSnackbar({ message: 'Task status updated', severity: 'success' })
      setStatusFilter('All')
      onStatusChange()
    } catch (error) {
      showSnackbar({
        message: 'Failed to update task status',
        severity: 'error'
      })
    }
  }

  return (
    <Select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      variant="outlined"
      size="small"
    >
      <MenuItem value="To Do">To Do</MenuItem>
      <MenuItem value="In Progress">In Progress</MenuItem>
      <MenuItem value="Completed">Completed</MenuItem>
    </Select>
  )
}

export default TaskStatusDropdown
