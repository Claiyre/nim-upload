import { searchParamToString } from './lib/utils'
import checkParams from './lib/checkParams'
import initFlyio from './lib/initFlyio'
import { defaultOptions } from './config'
import Handlers from './handlers'
import NimFile from './nimFile'
const h = new Handlers()

// TODO 参数更加健全
// TODO 添加对旧库的兼容，非promise情况下的兼容
// TODO add test
/**
 * @class Uploader
 * @param params 参数对象
 * @param params.target required 一个File对象/File对象数组/type='file'的input
 * @param params.trunkSize 分片大小，最大为4M
 * @param params.fileExts {Array} 可接受的文件类型，如['MP4', 'MKV']。 若不填，则表示不限制上传文件的类型
 * @param params.Nouce  随机数，用于接口鉴权
 * @param params.AppKey  开发者平台分配的AppKey，用于接口鉴权
 * @param params.CheckSum  服务器认证需要，SHA1(AppSecret+Nonce+CurTime)，16进制字符小写
 * @param params.[onError/onProgress/onUploaded] 各种监听事件，初始化后可通过 instance.on('error', handler)添加
 * Nouce,AppKey,CheckSum用于接口鉴权，可在应用服务器端存储和使用，但不应存储或传递到客户端，也不应在网页等前端代码中嵌入。
 * 因此不建议传入这三个参数，而是通过中间层拦ajax请求，将鉴权信息添加到header中。若这三个参数都被传入了，则nim-loader将会自行添加接口鉴权信息
 */
class Uploader {
  constructor (params) {
    const options = Object.assign({}, defaultOptions, params)
    this.fileList = []
    checkParams(options)
    Object.keys(options).forEach(key => {
      if (key.startsWith('on')) {
        this.on(key, options[key])
      } else {
        this[key] = options[key]
      }
    })
    /* 初始化Loader和NimFile的_fly，添加鉴权信息和响应拦截 */
    this._fly = initFlyio.call(this)
    NimFile.prototype._fly = this._fly

    if (this.target.nodeName === 'INPUT') {
      this.target.addEventListener('change', function (e) {
        this.addFile(e.target.files)
      }.bind(this))
    } else {
      this.addFile(this.target)
    }
  }
  /**
   * 添加事件处理
   * @param {String} eventName 事件名称
   * @param {Function} handler 对应的处理函数
   */
  on (eventName, handler) {
    let name
    if (eventName.startsWith('on')) {
      name = eventName
    } else {
      name = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
    }
    Handlers.prototype[name] = handler
  }
  /**
   * add file(s) to fileList
   * @param {FileArray/File} files
   */
  addFile (param) {
    let files = []
    let exts = this.options.fileExts
    if (param instanceof File) {
      files.push(param)
    } else if (param instanceof Array && param.every(item => item instanceof File)) {
      files = param.slice(0)
    } else {
      h.onError(new Error(`Method addFile's param can only be File object or File object array, not ${param}`))
    }
    if (exts instanceof Array && exts.length > 0) {
      files.forEach(item => this.fileList.push(new NimFile(item)))
    } else {
      /* 文件类型检查 */
      files.forEach(item => {
        let ext = item.name.split('.').pop()
        if (exts.find(ext)) {
          this.fileList.push(new NimFile(item))
          h.onAdded()
        } else {
          h.onFileTypeNotMatch(ext)
        }
      })
    }
  }
  /**
   * 根据fileKey得到NimFile实例对象
   * @param {String} fileKey NimFile实例对象的fileKey，唯一键值
   */
  findFile (fileKey) {
    return this.fileList.find(item => item.fileKey === fileKey)
  }
  /**
   * 上传所有文件
   */
  uploadAll () {
    let promiseArr = []
    this.fileList.forEach(item => {
      if (item.checked) {
        promiseArr.push(this.uploadFile(item.fileKey))
      }
    })
    return Promise.all(promiseArr).then(res => {
      h.onAllUploaded()
      return Promise.resolve()
    })
  }
  /**
   * 根据fileKey上传文件
   * @param {Number} fileKey 文件在fileList中的索引
   */
  uploadFile (fileKey) {
    let file = this.find(fileKey)
    let xNosToken, // 上传凭证
      bucket, //
      object, //
      address, //
      offset //
    file.getInitInfo(this.options).then(res => {
      // 获取上传初始化信息
      xNosToken = res.xNosToken
      bucket = res.bucket
      object = res.object
      xNosToken = res.xNosToken
      return file.getAddress(bucket)
    }).then(res => {
      // 获取上传加速节点地址
      address = res
      return file.getOffset(xNosToken, bucket, object)
    }).then(res => {
      // 获取偏移量
      offset = res.offset
      return this._uploadTrunk(file, xNosToken, bucket, object, offset, address)
    }).then(res => {
      h.onUploaded(file.fileKey)
      return Promise.resolve(file.fileKey)
    }).catch(err => {
      h.onError(err)
    })
  }
  /**
   * 上传文件分片
   * @param {FileList} file
   * @param {String} xNosToken 上传凭证
   * @param {String} bucket 存储上传文件的桶名
   * @param {String} object 存储上传文件的对象名
   * @param {String} offset 上传文件加速节点地址
   * @param {String} address 断点续传下一个上传片的偏移
   */
  _uploadTrunk (file, xNosToken, bucket, object, offset, address) {
    let trunkSize = file.trunkSize || this.options.trunkSize
    let trunkData = file.file.slice(offset, offset + trunkSize)
    let that = this
    let url = searchParamToString({
      bucket,
      object,
      complete: false,
      version: '1.0',
      context: localStorage.getItem(file.fileKey + '_context') || ''
    })
    url = `${address}/${bucket}/${object}?${url}`
    return this._fly.post(url, trunkData, {
      headers: {
        'x-nos-token': xNosToken,
        'Content-Length': trunkSize
      }
    }).then(res => {
      if (!res.offset) {
        return Promise.reject(new Error(`File upload request ${res.requestId} failed`))
      }
      localStorage.setItem(file.fileKey + '_context', res.context)
      file.updateProgress(res.offset)
      if (res.offset < file.size) {
        /* 继续上传下一片 */
        return that._uploadTrunk(file, xNosToken, bucket, object, res.offset, address)
      } else {
        return Promise.resolve(res)
      }
    }).catch(err => {
      h.onError(err)
    })
  }
  /**
   * 移除文件
   * @param {Number} fileKey 文件索引
   */
  removeFile (fileKey) {
    let file = this.findFile(fileKey)
    file.ruin()
    let fileIndex = this.indexOf(file)
    if (fileIndex > -1) {
      this.fileList.splice(fileIndex, 1)
    }
  }
}

export default Uploader
