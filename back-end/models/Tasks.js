import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Completed'],
      default: 'To Do'
    },
    description: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Tasks = mongoose.model('task', taskSchema)
export default Tasks
