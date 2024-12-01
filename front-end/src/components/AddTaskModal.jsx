import {
  Box,
  Button,
  Modal,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikInputField from './FormikInputField' // Import the custom input component

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters long.')
    .max(100, 'Title can be at most 100 characters long.')
    .required('Title is required'),
  status: Yup.string()
    .oneOf(
      ['To Do', 'In Progress', 'Completed'],
      'Status must be one of To Do, In Progress, Completed.'
    )
    .required('Status is required'),
  description: Yup.string()
    .max(500, 'Description can be at most 500 characters long.')
    .optional()
})

const AddTaskModal = ({ open, onClose, onSave, initialTask }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  const initialValues = initialTask || {
    title: '',
    status: 'To Do',
    description: ''
  }

  const handleSubmit = (values, { resetForm }) => {
    onSave(values)
    resetForm()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          width: isMobile
            ? '90%'
            : isTablet
            ? '80%'
            : isDesktop
            ? '50%'
            : '60%',
          maxHeight: '90vh',
          overflowY: 'auto',
          p: isMobile ? 2 : isTablet ? 3 : isDesktop ? 4 : 5,
          fontSize: isMobile
            ? '0.875rem'
            : isTablet
            ? '1rem'
            : isDesktop
            ? '1.125rem'
            : '1.25rem'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form>
              <Box display="flex" flexDirection="column" gap={2}>
                <FormikInputField
                  name="title"
                  label="Title"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <FormikInputField
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <FormikInputField
                  name="status"
                  label="Status"
                  select
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </FormikInputField>

                <Button type="submit" variant="contained" color="primary">
                  {initialTask ? 'Update Task' : 'Add Task'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}

export default AddTaskModal
