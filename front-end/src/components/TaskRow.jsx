import React from 'react'
import { TableCell, TableRow, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TaskStatusDropdown from './TaskStatusDropdown'

const TaskRow = ({
  index,
  task,
  onEdit,
  onDelete,
  onStatusChange,
  setStatusFilter
}) => (
  <TableRow>
    <TableCell>{index}</TableCell>
    <TableCell>{task.title}</TableCell>
    <TableCell>
      <TaskStatusDropdown
        task={task}
        onStatusChange={onStatusChange}
        setStatusFilter={setStatusFilter}
      />
    </TableCell>
    <TableCell>{task.description}</TableCell>
    <TableCell>
      <IconButton color="primary" onClick={() => onEdit(task)}>
        <EditIcon />
      </IconButton>
      <IconButton color="secondary" onClick={() => onDelete(task._id)}>
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
)

export default TaskRow
