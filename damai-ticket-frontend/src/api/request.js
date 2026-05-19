import axios from 'axios'

const request = axios.create({
  baseURL: '',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    const data = response.data
    if (data.code === 0) {
      return data.data
    }
    return Promise.reject(data)
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request