import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import TaskList from './pages/TaskList'
import { SnackbarProvider } from './snakebarContext'

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <Routes>
          <Route path="/" element={<TaskList />}></Route>
        </Routes>
      </SnackbarProvider>
    </Router>
  )
}

export default App
