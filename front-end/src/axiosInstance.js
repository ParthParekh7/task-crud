import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_KEY || 'http://localhost:9001/api'
})

export default axiosInstance
