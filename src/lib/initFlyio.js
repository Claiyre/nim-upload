import fly from 'flyio'
import Handlers from '../handlers'
const h = new Handlers()

/**
 * flyio初始化函数：1.添加接口鉴权信息 2.拦截错误ajax响应，触发onError
 * @method initFlyio
 */
export default function initFlyio () {
  let context = this
  // 若鉴权参数存在，则拦截请求在header中添加接口鉴权信息
  if (this.AppKey && this.Nonce && this.CheckSum && this.CurTime) {
    fly.interceptors.request.use((request) => {
      if (request.method === 'GET') return
      if (request.url.indexOf('context=') > -1) {
        request.headers['Content-Type'] = 'application/json;charset=UTF-8'
        return
      }
      request.headers['AppKey'] = context.AppKey
      request.headers['Nonce'] = context.Nonce
      request.headers['CheckSum'] = context.CheckSum
      request.headers['CurTime'] = context.CurTime
    })
  }
  // 添加响应拦截器
  fly.interceptors.response.use((response) => {
    return response.data
  }, (err) => {
    h.onError(err)
    return Promise.reject(err)
  })

  return fly
}
