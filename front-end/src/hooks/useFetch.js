import { useEffect, useState } from 'react'
import { useSnackbar } from '../snakebarContext'
import axiosInstance from '../axiosInstance'

const useFetch = (url, config = {}, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { showSnackbar } = useSnackbar()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(url, config)
      setData(response?.data || response)
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      showSnackbar({
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
