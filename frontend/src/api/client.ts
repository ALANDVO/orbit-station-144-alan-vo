import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        console.error('API Error:', error.response?.status, error.message)
        return Promise.reject(error)
      }
    )
  }
  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async healthCheck(): Promise<{ status: string; database: string }> {
    const response = await this.client.get('/health')
    return response.data
  }

  async healthCheckDb(): Promise<{ status: string; database: string }> {
    const response = await this.client.get('/health/db')
    return response.data
  }

  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    const response = await this.client.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  get axiosInstance(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient()