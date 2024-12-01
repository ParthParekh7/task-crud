import React, { useState } from 'react'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import AddTaskModal from '../components/AddTaskModal'
import TaskRow from '../components/TaskRow'
import axiosInstance from '../axiosInstance'
import { useSnackbar } from '../snakebarContext'
import useFetch from '../hooks/useFetch'

const TaskList = () => {
  const [openModal, setOpenModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const { showSnackbar } = useSnackbar()
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchTasksUrl = `/tasks?status=${statusFilter}`

  const { data, loading, error, refetch } = useFetch(fetchTasksUrl, {}, [
    statusFilter
  ])
  const tasks = data?.tasks || []

  const handleAddOrUpdateTask = async (task) => {
    try {
      if (task._id) {
        await axiosInstance.put(`/tasks/${task._id}`, {
          title: task.title,
          status: task.status,
          description: task.description
        })
        showSnackbar({
          message: 'Task updated successfully',
          severity: 'success'
        })
      } else {
        await axiosInstance.post('/tasks', task)
        showSnackbar({
          message: 'Task added successfully',
          severity: 'success'
        })
      }
      refetch()
      setOpenModal(false)
      setEditTask(null)
    } catch (error) {
      showSnackbar({
        message:
          error?.response?.data?.message ||
          error.message ||
          'An error occurred',
        severity: 'error'
      })
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`)
      showSnackbar({
        message: 'Task deleted successfully',
        severity: 'success'
      })
      refetch()
    } catch (error) {
      showSnackbar({
        message:
          error?.response?.data?.message ||
          error.message ||
          'An error occurred',
        severity: 'error'
      })
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ flexWrap: 'wrap', gap: 2, mb: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Task List
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
          >
            Add Task
          </Button>
        </Box>
      </Box>
      <AddTaskModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setEditTask(null)
        }}
        onSave={handleAddOrUpdateTask}
        initialTask={editTask}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['No', 'Title', 'Status', 'Description', 'Actions'].map(
                (header, index) => (
                  <TableCell key={index}>
                    <strong>{header}</strong>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell>Loading tasks...</TableCell>
              </TableRow>
            ) : tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskRow
                  key={task._id}
                  index={index + 1}
                  task={task}
                  onEdit={(task) => {
                    setEditTask(task)
                    setOpenModal(true)
                  }}
                  onDelete={handleDeleteTask}
                  setStatusFilter={setStatusFilter}
                  onStatusChange={refetch}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No tasks available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TaskList
