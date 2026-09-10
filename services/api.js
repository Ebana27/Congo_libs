import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://ledevfreelance.pythonanywhere.com/api/v1'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const AUTH_TOKEN_STORAGE_KEY = 'congolibs_auth_token'

async function getStoredToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Token ${token}`,
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export async function loginMobile(username, password) {
  const response = await api.post('/users/auth/login-mobile/', { username, password })
  const token = response.data?.token
  const user = response.data?.user

  if (token) {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  }

  return response.data
}

export async function registerMobile({ username, email, password1, password2 }) {
  const response = await api.post('/users/auth/register-mobile/', {
    username,
    email,
    password1,
    password2,
  })

  const token = response.data?.token
  if (token) {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  }

  return response.data
}

export async function logoutMobile() {
  try {
    await api.post('/users/auth/logout-mobile/')
  } finally {
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }
}

export async function fetchCurrentUser() {
  const response = await api.get('/users/auth/user/')
  return response.data
}

export async function authHeaderForRequest() {
  const token = await getStoredToken()
  return token ? `Token ${token}` : ''
}

export default api
