import React from 'react'
import { TextField } from '@mui/material'
import { Field } from 'formik'

const FormikInputField = ({ name, label, type = 'text', ...props }) => {
  return (
    <Field
      name={name}
      as={TextField}
      type={type}
      label={label}
      fullWidth
      {...props}
    />
  )
}

export default FormikInputField
