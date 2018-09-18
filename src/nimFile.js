import md5 from 'md5'
import Handlers from './handlers'

let h = new Handlers()
class NimFile {
  constructor (file) {
    if (!(file instanceof File)) {
      h.onError(new Error(`class NimFile's param can only be File object, not ${file}`))
      return false
    }
    let fileKey = md5(file.name + ':' + file.size)
    this.file = file
    this.fileKey = fileKey
    this.fileName = file.name
    this.format = file.name.split('.').pop()
    this.checked = true
    this.status = 0 /* 0: 等待上传 1: 上传中 2: 上传完毕 */
    this.progress = 0
    localStorage.setItem(fileKey + '_created', new Date())
  }
  /**
   * 文件上传初始化，获取xNosToken（上传凭证）、bucket（存储对象的桶名）、object（生成的唯一对象名）
   * @param {Object} param 文件上传初始化的参数，都为非必填，具体含义同云信点播文件上传初始化
   */
  getInitInfo ({ userFileName, typeId, presetId, uploadCallbackUrl, callbackUrl, description, watermarkId, transOffset, transDuration }) {
    /* 初始化信息已存在 */
    if (this.xNosToken && this.bucket && this.object) {
      return Promise.resolve({
        xNosToken: this.xNosToken,
        bucket: this.bucket,
        object: this.object
      })
    }
    let p = {
      originFileName: this.fileName
    }
    /* 非必填参数 */
    userFileName && (p.userFileName = userFileName)
    typeId && (p.typeId = typeId)
    presetId && (p.presetId = presetId)
    uploadCallbackUrl && (p.uploadCallbackUrl = uploadCallbackUrl)
    callbackUrl && (p.callbackUrl = callbackUrl)
    description && (p.description = description)
    watermarkId && (p.watermarkId = watermarkId)
    transOffset && (p.transOffset = transOffset)
    transDuration && (p.transDuration = transDuration)

    return this._fly.post('https://vcloud.163.com/app/vod/upload/init', p).then(res => {
      if (res.code !== 200) {
        return Promise.reject(res.msg)
      }
      this.xNosToken = res.ret.xNosToken
      this.bucket = res.ret.bucket
      this.object = res.ret.object
      return Promise.resolve(res.ret)
    })
  }
  /**
   * 获取上传文件加速节点地址
   * @param {String} bucket 存储上传文件的桶名
   * @return {Promise} 加速节点地址
   */
  getAddress (bucket) {
    let address = this.address
    if (address) {
      return Promise.resolve(address)
    }
    return this._fly.get('http://wanproxy.127.net/lbs', {
      version: '1.0',
      bucketname: bucket
    }).then((res) => {
      if (!res.upload) {
        return Promise.reject(new Error('Get lbs failed:', res))
      }
      this.address = res.upload[0]
      return Promise.resolve(res.upload[0])
    })
  }
  getOffset () {
    return this._fly.get(`${this.address}/${this.bucket}/${this.object}?uploadContext`, {
      'x-nos-token': this.xNosToken,
      bucketName: this.bucket,
      objectName: this.object,
      context: localStorage.getItem(`${this.fileKey}_context`),
      version: '1.0'
    })
  }
  ruin () {
    localStorage.removeItem(`${this.fileKey}_context`)
    this.checked = false
  }
  updateStatus (status) {
    this.status = status
  }
  updateProgress (offset) {
    if (offset <= 0) {
      this.progress = 0
    } else if (offset < this.size) {
      let p = (offset / this.size).toFixed(4)
      this.status = 1
      this.progress = p
      h.onProgress(p)
    } else {
      this.progress = 1
      this.status = 2
      h.onProgress(1)
    }
  }
}

export default NimFile
