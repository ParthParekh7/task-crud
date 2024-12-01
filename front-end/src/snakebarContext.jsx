import React, { createContext, useContext, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const SnackbarContext = createContext()

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    vertical: 'top',
    horizontal: 'right'
  })

  const theme = useTheme()
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const showSnackbar = ({
    message,
    severity = 'success',
    vertical = 'top',
    horizontal = 'right'
  }) => {
    setSnackbar({
      open: true,
      message,
      severity,
      vertical,
      horizontal
    })
  }

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const Transition = (props) => {
    return <Slide {...props} direction="left" />
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal
        }}
        TransitionComponent={Transition}
        sx={{
          maxWidth: '90%',
          [theme.breakpoints.up('sm')]: {
            maxWidth: '70%'
          },
          [theme.breakpoints.up('md')]: {
            maxWidth: '60%'
          }
        }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            whiteSpace: 'pre-wrap',
            padding: isXsScreen ? '6px' : '10px',
            fontSize: isXsScreen ? '0.75rem' : '1rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
