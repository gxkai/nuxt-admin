/* eslint-disable no-debugger */
import axios from 'axios'
import {getToken, removeToken} from '../mixins'
import {Message} from 'element-ui'

export default ({ redirect }) => {
  axios.interceptors.request.use(
    async config => {
      /**
       * process.env.NODE_ENV: 判断开发模式
       * @type {string}
       */
      config.baseURL = process.env.NODE_ENV !== 'production' ? 'http://172.16.11.138:8085/supervise' : 'http://172.16.0.151:8085/supervise'
      const token = await getToken()
      if (token) {
        config.headers.Authorization = token
      } else {
        redirect('/login')
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            removeToken()
            Message({
              message: '账号过期/被踢，请重新登录',
              type: 'warning'
            })
            redirect('/login')
            break
          case 400:
            if (
              error.response.data.fieldErrors !== undefined &&
              error.response.data.fieldErrors !== null
            ) {
              Message({
                message: error.response.data.fieldErrors[0].message,
                type: 'error'
              })
            } else {
              Message({
                message: error.response.data.message,
                type: 'error'
              })
            }
            redirect('/login')
            break
          case 500:
            Message({
              message: '网络繁忙',
              type: 'warning'
            })
            break
          default:
            Message({
              message: '网络异常',
              type: 'error'
            })
            break
        }
      }
      return Promise.reject(error)
    }
  )
}
