const defaultHandlers = {
  /**
   * @method onError
   */
  onError: function (err) {
    console.error(err)
  },
  /**
   * 文件上传进度
   * @method onProgress
   */
  onProgress: function (p) {

  },
  /**
   * 单个文件上传成功回调
   * @method onUploaded
   */
  onUploaded: function (file) {

  },
  /**
   * 所有文件上传成功后的回调，upLoadAll后才会触发
   */
  onAllUploaded: function (fileList) {

  },
  /**
   * 向fileList中添加文件成功的回调
   */
  onAdded: function (file) {

  },
  /**
   * 向fileList中添加的文件已存在的回调
   */
  existFn: function (file) {

  }
}

const defaultOptions = {
  /**
   * 分片大小，最大4M
   * @type {Number}
   */
  trunkSize: 4 * 1024 * 1024,
  /**
   * 文件类型
   * @type {Array}
   */
  fileExts: ['JPG', 'PNG', 'WMV', 'ASF', 'AVI', '3GP', 'MKV', 'MP4', 'DVD', 'OGM', 'MOV', 'MPG', 'MPEG', 'MPE', 'FLV', 'F4V', 'SWF', 'M4V', 'QT', 'DAT', 'VOB', 'RMVB', 'RM', 'OGM', 'M2TS', 'MTS', 'TS', 'TP', 'WEBM', 'MP3', 'AAC'],
  /**
   * 一些默认的事件处理函数
   * @type {Function}
   */
  ...defaultHandlers
}

export {
  defaultHandlers,
  defaultOptions
}
