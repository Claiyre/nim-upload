/**
 * 事件监听函数
 */
class Handlers {
  /**
   * @method onError
   */
  onError (err) {
    console.error(err)
  }
  /**
   * 文件上传进度
   * @method onProgress
   */
  onProgress (p) {

  }
  /**
   * 单个文件上传成功回调
   * @method onUploaded
   */
  onUploaded (file) {

  }
  /**
   * 所有文件上传成功后的回调，upLoadAll后才会触发
   */
  onAllUploaded (fileList) {

  }
  /**
   * 向fileList中添加文件成功的回调
   */
  onAdded (fileKey) {

  }
  /**
   * 文件类型不匹配
   */
  onFileTypeNotMatch (type) {
    this.onError(`${type} is not accepted by this uploader`)
  }
}

export default Handlers
