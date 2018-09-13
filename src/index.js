import { defaultOptions } from './config'
import checkParams from './lib/checkParams'
import initFlyio from './lib/initFlyio'
import md5 from 'md5'
/**
 * @class Uploader
 * @param params 参数对象
 * @param params.target required 一个type='file'的input/File对象/File对象数组
 * @param params.trunkSize 分片大小，最大为4M
 * @param params.Nouce  随机数，用于接口鉴权
 * @param params.AppKey  开发者平台分配的AppKey，用于接口鉴权
 * @param params.CheckSum  服务器认证需要，SHA1(AppSecret+Nonce+CurTime)，16进制字符小写
 * @param params.[onError/onProgress/onAllUploaded/onAdd/existFn] 各种监听事件，初始化后可通过 instance.on('error', handler)添加
 * Nouce,AppKey,CheckSum用于接口鉴权，可在应用服务器端存储和使用，但不应存储或传递到客户端，也不应在网页等前端代码中嵌入。因此不建议传入这三个参数，而是通过中间层拦ajax请求，将鉴权信息添加到header中。若这三个参数都被传入了，则nim-loader将会自行添加接口鉴权信息
 */
class Uploader {
  constructor (params) {
    const options = Object.assign({}, defaultOptions, arguments)
    checkParams(params)
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
    this.fileList = []
    this._fly = initFlyio.call(this)
    if (this.target.nodeName === 'INPUT') {
      if (this.target.type !== 'file') {
        this.onError(new Error(`param.target cam only be file input dom, File object or File object array. Not ${this.target}`))
        return
      }
      this.target.onchange = (e) => {
        this.addFile(e.target.files)
      }
    } else {
      this.addFile(this.target)
    }
  }
  /**
   * add file(s) to fileList
   * @param {FileArray/File} files
   */
  addFile (param) {
    // TODO: files可以是File数组或者File对象
    let files = []
    if (param instanceof File) {
      files.push(param)
    } else if (param instanceof Array && param.every(item => item instanceof File)) {
      files = param.slice(0)
    } else {
      this.onError(new Error(`Method addFile's param can only be File object or File object array, not ${param}`))
    }
    files.forEach(item => {
      let fileKey = md5(item.name + ':' + item.size)
      this.fileList.push({
        fileKey,
        file: item,
        fileName: item.name,
        format: item.name.split('.').pop(),
        checked: true,
        status: 0,
        progress: 0
      })
      localStorage.setItem(fileKey + '_created', new Date())
    })
  }
  removeFile (files) {
    // TODO 删除文件，终止上传并从列表中移除
  }
  upLoadFile (id) {

  }
  upLoadAll () {

  }
  _uploadTrunk () {

  }
  _initUpload () {

  }
}

export default Uploader
