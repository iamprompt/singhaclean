import axios from 'axios'

import { serverFetch } from '@/lib/fetch.server'

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const { data } = await axios.post('/api/auth/login', {
    email,
    password,
  })
  return data
}

export const logout = async () => {
  const { data } = await axios.get('/api/auth/logout')
  return data
}

export const getMe = async () => {
  try {
    const data = await serverFetch('/api/auth/me')
    return data
  } catch (error) {
    return null
  }
}
