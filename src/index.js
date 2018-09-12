import { defaultOptions } from './config'
import checkParams from './lib/checkParams'

/**
 * @class Uploader
 * @param params 参数对象
 * @param params.AppKey required 开发者平台分配的AppKey，用于接口鉴权
 * @param params.Nouce required 随机数，用于接口鉴权
 * @param params.CurTime required UTC时间戳，用于接口鉴权
 * @param params.CheckSum required 服务器认证需要，SHA1(AppSecret+Nonce+CurTime)，16进制字符小写
 * @param params.trunkSize 分片大小，最大为4M
 * @param params.(onError/onProgress/onProgress/onAllUploaded/onAdd/existFn)
 */

class Uploader {
  constructor (params) {
    const options = Object.assign({}, defaultOptions, arguments)

    checkParams(params)
    console.log(options)
  }
}

export default Uploader
