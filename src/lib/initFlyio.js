import fly from 'flyio'

/**
 * flyio初始化函数：1.添加接口鉴权信息 2.拦截错误ajax响应，触发onError
 * @method initFlyio
 */
export default function initFlyio () {
  let context = this
  // 若鉴权参数存在，则拦截请求在header中添加接口鉴权信息
  if (this.AppKey && this.Nonce && this.CheckSum) {
    fly.interceptors.request.use((request) => {
      request.headers['AppKey'] = context.AppKey
      request.headers['Nonce'] = context.Nonce
      request.headers['CheckSum'] = context.CheckSum
      request.headers['CurTime'] = parseInt(new Date().getTime() / 1000)
    })
  }
  // 添加响应拦截器
  fly.interceptors.response.use((response) => {
    return response.data
  }, (err) => {
    context.onError(err)
    return Promise.reject(err)
  })

  return fly
}
