import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000 // ms
}) // 创建一个新的axios对象

service.interceptors.request.use(
  config => {
    // 注入token
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // 失败执行promise
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.data instanceof Blob) return response.data // 返回 Blob 对象
    // axios 默认包裹一层data
    const { data, message, success } = response.data // 默认json格式
    if (success) {
      return data
    } else {
      Message({ type: 'error', message })
      return Promise.reject(new Error(message))
    }
  },
  async error => {
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'Token 超时' })
      // token 超时
      await store.dispatch('user/logout') // vuex的退出登录
      router.push('/login')
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)

export default service
