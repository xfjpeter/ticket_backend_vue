import axios from 'axios'
import { Notification } from 'element-ui'
import Cookie from 'js-cookie'

class Http {
  constructor() {
    this.baseURL = process.env.VUE_APP_BASE_URL
  }

  get ({ url, data }) {
    return this.request({ url, method: 'get', data })
  }

  post ({ url, data }) {
    return this.request({ url, method: 'post', data })
  }

  delete ({ url, data }) {
    return this.request({ url, method: 'delete', data })
  }

  request ({ url, method, data }) {
    const promise = new Promise((resolve, reject) => {
      axios({
        baseURL: this.baseURL,
        url,
        method,
        data: method === 'post' ? data : {},
        param: method === 'get' ? data : {},
        headers: {
          Authorization: Cookie.get('authorization')
        }
      })
        .then(res => {
          if (res.data.err_code == -1) {
            Cookie.remove('authorization')
            Cookie.remove('info')
            window.location.reload()
          }
          if (res.data.err_code != 0) {
            Notification.error({
              title: '提示',
              message: res.data.message
            })
          }
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
          Notification.error({
            type: 'error',
            title: '提示',
            message: '系统错误'
          })
        })
    })

    return promise
  }
}

export default Http