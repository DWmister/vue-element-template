import axios from 'axios'
import { Message } from 'element-ui'
import { req, res } from '@/utils/http/ctx'

const service = axios.create({
  baseURL: 'http://localhost:7072',
  timeout: 5000
})
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return req(config)
  }, 
  error => {
    // 对请求错误做些什么
    Promise.reject(error)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return res(response)
  },
  error => {
    // 对响应错误做点什么
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
