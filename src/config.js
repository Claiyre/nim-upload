const defaultHandlers = {
  error: function (err) {
    console.error(err)
  }
}

const defaultOptions = {
  /**
   * 分片大小，最大4M
   * @type {Number}
   */
  trunkSize: 4 * 1024 * 1024,
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
