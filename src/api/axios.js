import axios from 'axios'

const api = axios.create({
  baseURL: 'https://transactional-app-zvo6-git-fast-fi-a7778b-justchuks23s-projects.vercel.app',
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
