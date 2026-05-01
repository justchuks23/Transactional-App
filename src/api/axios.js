import axios from 'axios'

const api = axios.create({
  baseURL: 'https://transaction-app-uhk4.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export default api
